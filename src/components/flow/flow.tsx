"use client";

import "@xyflow/react/dist/style.css";

import { ReactFlow, Background, Controls, type NodeTypes } from "@xyflow/react";
import { useShallow } from "zustand/react/shallow";
import { type DragEvent } from "react";

import { useNodeStore } from "@/components/flow/store";
import { preventDefault } from "@/lib/utils";

import PromptNode from "@/components/flow/nodes/prompt";
import DbNode from "@/components/flow/nodes/db";
import InputNode from "@/components/flow/nodes/input";
import OutputNode from "@/components/flow/nodes/output";
import { type AideState } from "./types";

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
  workflow: state.workflow,
});

export default function Flow() {
  const {
    viewport,
    nodes,
    workflow,
    edges,
    onNodesChange,
    onEdgesChange,
    setViewport,
    onConnect,
    createNode,
    currentType,
  } = useNodeStore(useShallow(selector));

  if (workflow.id === "")
    return (
      <div className="flex h-[calc(100svh-3rem)] items-center justify-center border-t bg-neutral-100">
        <span className="text-4xl font-bold text-neutral-300">
          No Workflow Chosen
        </span>
      </div>
    );

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
