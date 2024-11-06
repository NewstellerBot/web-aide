"use client";

import "@xyflow/react/dist/style.css";

import { ReactFlow, Background, Controls } from "@xyflow/react";
import { useShallow } from "zustand/react/shallow";

import { useNodeStore } from "@/components/flow/store";
import PromptNode from "@/components/flow/nodes/prompt";
import Sidebar from "@/components/flow/sidebar";

const nodeTypes = {
  prompt: PromptNode,
};

export default function Flow() {
  const { nodes, edges, onNodesChange, onEdgesChange } = useNodeStore(
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
    })),
  );
  return (
    <div className="flex h-[calc(100vh-28px)] w-screen border-t">
      <Sidebar />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodesConnectable={true}
        nodeTypes={nodeTypes}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
