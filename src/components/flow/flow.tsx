"use client";

import "@xyflow/react/dist/style.css";

import { ReactFlow, Background, Controls } from "@xyflow/react";
import { useShallow } from "zustand/react/shallow";
import { type DragEvent } from "react";

import { useNodeStore } from "@/components/flow/store";
import PromptNode from "@/components/flow/nodes/prompt";
import Sidebar from "@/components/flow/sidebar";
import { preventDefault } from "@/lib/utils";

const nodeTypes = {
  prompt: PromptNode,
};

export default function Flow() {
  const {
    viewport,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    setViewport,
    createNode,
    currentType,
  } = useNodeStore(
    useShallow((state) => ({
      currentType: state.currentType,
      viewport: state.viewport,
      nodes: state.nodes,
      edges: state.edges,
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
      setViewport: state.setViewport,
      createNode: state.createNode,
    })),
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
    <div className="flex h-[calc(100vh-36px)] w-screen border-t">
      <Sidebar />

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
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
