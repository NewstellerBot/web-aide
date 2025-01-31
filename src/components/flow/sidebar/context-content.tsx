"use client";

import { ContextMenuItem } from "@/components/ui/context-menu";
import { deleteWorkflow } from "@/app/actions/db/workflow/delete";
import { type Workflow } from "@/app/actions/db/workflow/get";

export default function ContextContent({ workflow }: { workflow: Workflow }) {
  return (
    <>
      <ContextMenuItem
        onClick={async () => {
          await deleteWorkflow(workflow.id);
        }}
      >
        Delete
      </ContextMenuItem>
    </>
  );
}
