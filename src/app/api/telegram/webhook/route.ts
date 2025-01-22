import TelegramBot from "node-telegram-bot-api";

import { updateSchema } from "@/app/api/telegram/schema";
import { TelegramError } from "../errors";
import { apiWrapper } from "../wrapper";

const TG_TOKEN = "8011966300:AAEXtz289cMCsuqVT_Zm5DVqRRix6VHCfOI";

export const POST = async (req: Request) =>
  apiWrapper(async (req: Request) => {
    const body = (await req.json()) as unknown;

    const tg = updateSchema.parse(body);
    const chatId = tg.message?.chat?.id;
    if (!chatId)
      throw new TelegramError({ name: "BAD_REQUEST", message: "No chatId" });

    const bot = new TelegramBot(TG_TOKEN, { polling: false });
    await bot.sendMessage(
      chatId,
      "Hello from the bot!\nGot message: **" + JSON.stringify(tg) + "**",
    );

    return Response.json({ success: true });
  })(req);
