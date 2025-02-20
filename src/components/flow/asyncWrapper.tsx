import { get as getWorkflow } from "@/app/actions/db/workflow/get";
import { getAll } from "@/app/actions/db/knowledge/get";
import Flow from "@/components/flow/clientFlow";
import { AideError } from "@/lib/errors";
import Image from "next/image";
import { Separator } from "../ui/separator";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

export default async function Wrapper({ id }: { id: string }) {
  try {
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
