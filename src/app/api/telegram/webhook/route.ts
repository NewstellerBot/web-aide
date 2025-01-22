import { updateSchema } from "@/app/api/telegram/schema";

export async function POST(req: Request) {
  const body = (await req.json()) as unknown;
  const parseResult = updateSchema.safeParse(body);
  if (!parseResult.success) {
    return Response.json({ error: parseResult.error.message }, { status: 400 });
  }
  const tg = parseResult.data;
  console.log(tg);
}
