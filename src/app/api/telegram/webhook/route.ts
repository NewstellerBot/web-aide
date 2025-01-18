export async function POST(req: Request) {
  const body = (await req.json()) as unknown;
  console.log(body);
  return Response.json({ message: "ok" });
}
