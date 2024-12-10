"use client";

import { useShallow } from "zustand/react/shallow";
import { useState } from "react";

import { SidebarMenuButton } from "@/components/ui/sidebar";
import type { Workflow } from "@/app/actions/db/workflow/get";
import { useNodeStore } from "@/components/flow/store";
import { get } from "@/app/actions/db/workflow/get";
import { upsert } from "@/app/actions/db/workflow/upsert";
import DOMPurify from "isomorphic-dompurify";

export default function ActivateWorkflow({ workflow }: { workflow: Workflow }) {
  const { setWorkflow, setNodes, setEdges } = useNodeStore(
    useShallow((state) => ({
      setWorkflow: state.setWorkflow,
      setNodes: state.setNodes,
      setEdges: state.setEdges,
    })),
  );
  const [isContentEditable, setIsContentEditable] = useState(false);
  const [name, setName] = useState(workflow.name);
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
        <span
          contentEditable={isContentEditable}
          onKeyDown={async (e) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            e.currentTarget.blur();
          }}
          onDoubleClick={(e) => {
            setIsContentEditable(true);
            e.currentTarget.focus();
          }}
          onBlur={async (e) => {
            setIsContentEditable(false);
            const newName = DOMPurify.sanitize(e.currentTarget.innerText);
            setName(newName);
            await upsert({ ...workflow, name: newName });
          }}
          dangerouslySetInnerHTML={{ __html: name }}
        />
      </SidebarMenuButton>
    </>
  );
}
