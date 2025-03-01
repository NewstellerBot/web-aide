import TelegramBot from "node-telegram-bot-api";
import { neon } from "@neondatabase/serverless";
import { z } from "zod";

import { updateSchema } from "@/app/api/telegram/schema";
import { TelegramError } from "@/app/api/telegram/errors";
import { get } from "@/app/actions/db/workflow/get";
import { BotSchema } from "@/app/actions/db/bot/schema";
import { apiWrapper } from "@/app/api/wrapper";
import { adjustBotNodes, chunkMessage } from "@/app/api/telegram/webhook/util";
import { executeGraph } from "@/app/actions/llm/execute";
import { verifyJWT } from "@/lib/jwt";
import { env } from "@/env";

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
  console.log("[Telegram]: Chatting with chat id: ", chatId);

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

      const chunks = chunkMessage(msg);
      return chunks.map((chunk) =>
        tgBot.sendMessage(chatId, chunk, { parse_mode: "Markdown" }),
      );
    }),
  );

  return Response.json({ success: true });
});
