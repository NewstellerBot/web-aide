import { get as getWorkflow } from "@/app/actions/db/workflow/get";
import { getAll } from "@/app/actions/db/knowledge/get";
import Flow from "@/components/flow/clientFlow";

export default async function Wrapper({ id }: { id: string }) {
  const [{ nodes, edges }, knowledgeBases] = await Promise.all([
    getWorkflow({ id }),
    getAll(),
  ]);

  return (
    <Flow
      initialNodes={nodes}
      initialEdges={edges}
      workflowId={id}
      knowledgeBases={knowledgeBases}
    />
  );
}
