"use client";

import "@xyflow/react/dist/style.css";

import { ReactFlow, Background, Controls, type NodeTypes } from "@xyflow/react";
import { useShallow } from "zustand/react/shallow";
import { type DragEvent } from "react";

import { useNodeStore } from "@/components/flow/store";
import PromptNode from "@/components/flow/nodes/prompt";
import { preventDefault } from "@/lib/utils";
import DbNode from "@/components/flow/nodes/db";

import { type AideState } from "./types";

const nodeTypes: NodeTypes = {
  prompt: PromptNode,
  db: DbNode,
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
});

export default function Flow() {
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
  } = useNodeStore(useShallow(selector));

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const { top, left } = (e.target as HTMLElement).getBoundingClientRect();

    const position = {
      x: (e.clientX - left - viewport.x) / viewport.zoom,
      y: (e.clientY - top - viewport.y) / viewport.zoom,
    };

    console.log("current type: ", currentType);
    console.log("nodes", nodes);

    createNode(currentType, position);
  };

  return (
    <div className="flex h-[calc(100vh-36px)] w-screen border-t">
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
