"use client";

import { SidebarMenuButton } from "@/components/ui/sidebar";
import type { Workflow } from "@/app/actions/db/workflow/get";
import { useNodeStore } from "@/components/flow/store";
import { get } from "@/app/actions/db/workflow/get";
import { useShallow } from "zustand/react/shallow";

export default function ActivateWorkflow({ workflow }: { workflow: Workflow }) {
  const { setWorkflow, setNodes, setEdges } = useNodeStore(
    useShallow((state) => ({
      setWorkflow: state.setWorkflow,
      setNodes: state.setNodes,
      setEdges: state.setEdges,
    })),
  );
  return (
    <>
      <SidebarMenuButton
        asChild
        onClick={async () => {
          setWorkflow(workflow.id);
          const { nodes, edges } = await get({ id: workflow.id });
          setNodes(nodes);
          setEdges(edges);
        }}
      >
        <span>{workflow.name}</span>
      </SidebarMenuButton>
    </>
  );
}
