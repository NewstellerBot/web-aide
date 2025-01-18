export async function POST(req: Request) {
  const body = (await req.json()) as unknown;
  console.log("got webhook request: ", body);
  console.log("webhook fired");
  return Response.json({ message: "ok" });
}
