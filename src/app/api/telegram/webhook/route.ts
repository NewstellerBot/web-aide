import { updateSchema } from "@/app/api/telegram/schema";
// import { TelegramError } from "../errors";
// import { apiWrapper } from "../wrapper";

export const POST = async (req: Request) => {
  console.log("[Telegram api handler]: ", req.body?.toString());
  const body = (await req.json()) as unknown;
  try {
    const tg = updateSchema.parse(body);
    console.log(tg);
  } catch (e) {
    console.error("[Telegram api handler]: " + String(e));
  }

  // const body = (await req.json()) as unknown;

  // const tg = updateSchema.parse(body);
  // const chatId = tg.message?.chat?.id;

  // if (!chatId)
  //   throw new TelegramError({ name: "BAD_REQUEST", message: "No chatId" });

  // const bot = new TelegramBot(TG_TOKEN, { polling: false });
  // await bot.sendMessage(
  //   chatId,
  //   "Hello from the bot!\nGot message: **" + JSON.stringify(tg) + "**",
  // );

  return Response.json({ success: true });
};
