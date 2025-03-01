import { updateSchema } from "@/app/api/telegram/schema";
import { TelegramError } from "../errors";
import { apiWrapper } from "../../wrapper";
import { verifyJWT } from "@/lib/jwt";
import { z } from "zod";
import { neon } from "@neondatabase/serverless";
import { env } from "@/env";
import { BotSchema } from "@/app/actions/db/bot/schema";
import { get } from "@/app/actions/db/workflow/get";
import { adjustBotNodes } from "./util";
import { executeGraph } from "@/app/actions/llm/execute";
import TelegramBot from "node-telegram-bot-api";

const PayloadSchema = z.object({
  botId: z.string(),
  workflowId: z.string(),
});

export const POST = apiWrapper(async (req: Request) => {
  const token = req.headers.get("X-Telegram-Bot-Api-Secret-Token")?.trim();
  if (!token)
    throw new TelegramError({
      name: "UNAUTHORIZED",
      message: "No token",
    });

  const { success, payload } = verifyJWT(token);
  if (!success) {
    throw new TelegramError({
      name: "UNAUTHORIZED",
      message: "Invalid token",
    });
  }

  const { botId, workflowId } = PayloadSchema.parse(payload);
  const sql = neon(env.POSTGRES_URL);
  const [bot] = await sql`
    SELECT * FROM bots WHERE id = ${botId}
  `;
  const { workflow_id: dbWorkflowId, access_token: accessToken } =
    BotSchema.parse(bot);
  if (dbWorkflowId !== workflowId) {
    throw new TelegramError({
      name: "BAD_REQUEST",
      message: "Workflow id mismatch",
    });
  }

  // At this point, we know we have correct workflow
  // we have the access token for the bot and are ready
  // to make execute the workflow

  const body = (await req.json()) as unknown;
  const tg = updateSchema.parse(body);
  const chatId = tg.message?.chat?.id;

  if (!chatId)
    throw new TelegramError({ name: "BAD_REQUEST", message: "No chatId" });

  const { nodes: originalNodes, edges } = await get({ id: workflowId });
  const nodes = adjustBotNodes(originalNodes);

  const context = { botInput: tg.message?.text ?? "" };
  const result = await executeGraph({ nodes, edges, context });
  const tgBot = new TelegramBot(accessToken, { polling: false });

  const outputs = Object.keys(result).sort();
  await Promise.all(
    outputs.flatMap((outputId) => {
      const msg = result[outputId];
      if (!msg) return [];
      return tgBot.sendMessage(chatId, msg, { parse_mode: "Markdown" });
    }),
  );

  return Response.json({ success: true });
});
