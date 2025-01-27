import { get } from "@/app/actions/db/workflow/get";
import Flow from "@/components/flow/flow";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const { nodes, edges } = await get({ id });
  return <Flow initialNodes={nodes} initialEdges={edges} workflowId={id} />;
}
