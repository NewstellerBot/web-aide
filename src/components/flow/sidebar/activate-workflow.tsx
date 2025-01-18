"use client";

import { useShallow } from "zustand/react/shallow";
import { useEffect, useRef, useState } from "react";
import DOMPurify from "isomorphic-dompurify";

import { cn } from "@/lib/utils";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import type { Workflow } from "@/app/actions/db/workflow/get";
import { useNodeStore } from "@/components/flow/store";
import { get } from "@/app/actions/db/workflow/get";
import { upsert } from "@/app/actions/db/workflow/upsert";
import { debounce } from "@/lib/utils";
import { updateNodeDiff } from "@/components/flow/utils";
import { updateEdgeDiff } from "@/components/flow/utils";

export default function ActivateWorkflow({ workflow }: { workflow: Workflow }) {
  const {
    setWorkflow,
    setNodes,
    setEdges,
    workflow: activeWorkflow,
    setIsWorkflowLoading,
  } = useNodeStore(
    useShallow((state) => ({
      workflow: state.workflow,
      setWorkflow: state.setWorkflow,
      setNodes: state.setNodes,
      setEdges: state.setEdges,
      setIsWorkflowLoading: state.setIsWorkflowLoading,
    })),
  );
  const [isContentEditable, setIsContentEditable] = useState(false);
  const [name, setName] = useState(workflow.name);
  const unsubRef = useRef<() => void>();

  useEffect(() => {
    if (!!unsubRef.current) unsubRef.current();
  });

  return (
    <>
      <SidebarMenuButton
        className={cn(
          "hover:cursor-pointer",
          isContentEditable && "hover:cursor-text",
        )}
        variant={workflow.id === activeWorkflow.id ? "outline" : "default"}
        asChild
        onClick={async () => {
          setIsWorkflowLoading(true);
          setWorkflow(workflow);
          const { nodes, edges } = await get({ id: workflow.id });
          setNodes(nodes);
          setEdges(edges);

          const unsubNodes = useNodeStore.subscribe(
            (state) => ({ nodes: state.nodes, workflow: state.workflow }),
            debounce(200, updateNodeDiff),
            {
              equalityFn: (a, b) =>
                JSON.stringify(a.nodes) === JSON.stringify(b.nodes),
            },
          );

          const unsubEdges = useNodeStore.subscribe(
            (state) => ({ edges: state.edges, workflow: state.workflow }),
            debounce(100, updateEdgeDiff),
            {
              equalityFn: (a, b) =>
                JSON.stringify(a.edges) === JSON.stringify(b.edges),
            },
          );

          unsubRef.current = () => {
            unsubEdges();
            unsubNodes();
          };
          setIsWorkflowLoading(false);
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
