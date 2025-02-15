import { get } from "@/app/actions/db/workflow/get";
import { executeGraph } from "@/app/actions/llm/execute";
import { AideError } from "@/lib/errors";

type Payload = Record<string, string>;
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const context = (await request.json()) as Payload;
    const { nodes, edges } = await get({ id });
    const response = await executeGraph({ nodes, edges, context });
    return Response.json(response);
  } catch (e) {
    // console.error(e);
    if (e instanceof AideError) {
      switch (e.name) {
        case "DB_ERROR":
          return Response.json({ message: e.message }, { status: 404 });
        case "EXECUTION_ERROR":
          return Response.json({ message: e.message }, { status: 400 });
        case "LLM_ERROR":
          return Response.json({ message: e.message }, { status: 500 });
        case "PARSING_ERROR":
          return new Response("error");
      }
    }
    return new Response("Unknown error");
  }
}

// console.error(e);
