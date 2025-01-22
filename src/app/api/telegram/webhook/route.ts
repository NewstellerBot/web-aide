// import TelegramBot from "node-telegram-bot-api";

import { updateSchema } from "@/app/api/telegram/schema";

// const TG_TOKEN = "8011966300:AAEXtz289cMCsuqVT_Zm5DVqRRix6VHCfOI";

export async function POST(req: Request) {
  const body = (await req.json()) as unknown;
  console.log(body);
  const parseResult = updateSchema.safeParse(body);
  if (!parseResult.success) {
    return Response.json({ error: parseResult.error.message }, { status: 400 });
  }
  const tg = parseResult.data;

  return Response.json({ success: true });
}
