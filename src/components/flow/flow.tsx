"use client";

import "@xyflow/react/dist/style.css";

import {
  ReactFlow,
  Background,
  Controls,
  type NodeTypes,
  type Edge,
  type Node,
} from "@xyflow/react";
import { useShallow } from "zustand/react/shallow";
import { type DragEvent, useEffect } from "react";

import { useNodeStore, defaultStoreValues } from "@/components/flow/store";
import { preventDefault } from "@/lib/utils";

import PromptNode from "@/components/flow/nodes/prompt";
import DbNode from "@/components/flow/nodes/db";
import InputNode from "@/components/flow/nodes/input";
import OutputNode from "@/components/flow/nodes/output";
import { type AideState } from "./types";
import { Spinner } from "../ui/spinner";
import { updateNodeDiff, updateEdgeDiff } from "./utils";
import { debounce } from "@/lib/utils";

const nodeTypes: NodeTypes = {
  prompt: PromptNode,
  db: DbNode,
  APIInput: InputNode,
  APIOutput: OutputNode,
};

const selector = (state: AideState) => ({
  currentType: state.currentType,
  viewport: state.viewport,
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  setViewport: state.setViewport,
  createNode: state.createNode,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  setWorkflow: state.setWorkflow,
});

export function FlowSkeleton() {
  return (
    <div className="flex h-[calc(100svh-3rem)] items-center justify-center border-t bg-neutral-100">
      <Spinner />
    </div>
  );
}

export default function Flow({
  initialNodes,
  initialEdges,
  workflowId,
}: {
  initialNodes: Node[];
  initialEdges: Edge[];
  workflowId: string;
}) {
  const {
    viewport,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    setViewport,
    onConnect,
    createNode,
    currentType,
    setNodes,
    setEdges,
    setWorkflow,
  } = useNodeStore(useShallow(selector));

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setWorkflow({ id: workflowId, name: "" });

    const unsubNodes = useNodeStore.subscribe(
      (state) => ({ nodes: state.nodes, workflow: state.workflow }),
      debounce(200, updateNodeDiff),
      // debounce(200, console.log),
      { equalityFn: (a, b) => a.nodes === b.nodes, fireImmediately: false },
    );

    const unsubEdges = useNodeStore.subscribe(
      (state) => ({ edges: state.edges, workflow: state.workflow }),
      debounce(300, updateEdgeDiff),
      { equalityFn: (a, b) => a.edges === b.edges, fireImmediately: false },
    );

    return () => {
      unsubNodes();
      unsubEdges();
      useNodeStore.setState((s) => ({
        ...s,
        ...defaultStoreValues(),
      }));
    };
  }, [initialEdges, initialNodes, workflowId, setNodes, setEdges, setWorkflow]);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const { top, left } = (e.target as HTMLElement).getBoundingClientRect();
    const position = {
      x: (e.clientX - left - viewport.x) / viewport.zoom,
      y: (e.clientY - top - viewport.y) / viewport.zoom,
    };
    createNode(currentType, position);
  };

  return (
    <div className="flex h-[calc(100svh-3rem)] border-t">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodesConnectable={true}
        nodeTypes={nodeTypes}
        onViewportChange={setViewport}
        onDragEnter={preventDefault}
        onDragOver={preventDefault}
        onDrop={handleDrop}
        onConnect={onConnect}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
