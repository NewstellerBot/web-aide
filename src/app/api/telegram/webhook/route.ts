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
  console.log("[Telegram api handler]: ", req.body?.toString());

  const token = req.headers.get("X-Telegram-Bot-Api-Secret-Token")?.trim();
  console.log("[Telegram api handler]: token: ", token);
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
  const result = executeGraph({ nodes, edges, context });
  const tgBot = new TelegramBot(accessToken, { polling: false });
  await tgBot.sendMessage(chatId, JSON.stringify(result));

  console.log(
    "[Telegram api handler]: all is good. executing workflow: ",
    workflowId,
    " and bot with access token: ",
    accessToken,
  );

  return Response.json({ success: true });
});
