"use client";

import { useShallow } from "zustand/react/shallow";
import { useState } from "react";
import DOMPurify from "isomorphic-dompurify";

import { cn } from "@/lib/utils";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import type { Workflow } from "@/app/actions/db/workflow/get";
import { useNodeStore } from "@/components/flow/store";
import { get } from "@/app/actions/db/workflow/get";
import { upsert } from "@/app/actions/db/workflow/upsert";

export default function ActivateWorkflow({ workflow }: { workflow: Workflow }) {
  const {
    setWorkflow,
    setNodes,
    setEdges,
    workflow: activeWorkflow,
  } = useNodeStore(
    useShallow((state) => ({
      workflow: state.workflow,
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
        className={cn(
          "hover:cursor-pointer",
          isContentEditable && "hover:cursor-text",
        )}
        variant={workflow.id === activeWorkflow ? "outline" : "default"}
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
