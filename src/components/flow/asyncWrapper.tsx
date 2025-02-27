import { get as getWorkflow } from "@/app/actions/db/workflow/get";
import { getAll as getAllBots } from "@/app/actions/db/bot/get";
import { getAll as getAllKnowledgebases } from "@/app/actions/db/knowledge/get";
import Flow from "@/components/flow/clientFlow";
import { AideError } from "@/lib/errors";
import Image from "next/image";
import { Separator } from "../ui/separator";

export default async function Wrapper({ id }: { id: string }) {
  try {
    const [{ nodes, edges }, bots, knowledgeBases] = await Promise.all([
      getWorkflow({ id }),
      getAllBots(),
      getAllKnowledgebases(),
    ]);

    return (
      <Flow
        initialNodes={nodes}
        initialEdges={edges}
        workflowId={id}
        bots={bots}
        knowledgeBases={knowledgeBases}
      />
    );
  } catch (e) {
    if (e instanceof AideError) {
      return (
        <div className="flex h-[calc(100svh-3rem)] flex-col items-center justify-center">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Image alt="" src="/logo.svg" height={30} width={30} />
              <p className="font-bold">aide</p>
            </div>
            <Separator />
            <p className="text-xs">{e.message}</p>
          </div>
        </div>
      );
    }
  }
}
