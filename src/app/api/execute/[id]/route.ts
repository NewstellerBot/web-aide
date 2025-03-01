import { get } from "@/app/actions/db/workflow/get";
import { executeGraph } from "@/app/actions/llm/execute";
import { apiWrapper } from "../../wrapper";

type Payload = Record<string, string>;

export const POST = apiWrapper(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const id = (await params).id;
    const context = (await request.json()) as Payload;
    const { nodes, edges } = await get({ id });
    const response = await executeGraph({ nodes, edges, context });
    return Response.json(response);
  },
);
