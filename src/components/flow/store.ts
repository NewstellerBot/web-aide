import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Edge,
} from "@xyflow/react";
import { create } from "zustand";
import { v4 as uuid } from "uuid";

import type { AideState, NodeType } from "./types";
import type { PromptNode, AideNode } from "./nodes/types";

const deafultNode = (
  type: NodeType,
  position?: { x: number; y: number },
): PromptNode => ({
  id: uuid(),
  position: position ?? { x: 50, y: 50 },
  data: {
    prompt: "",
    isLoading: false,
  },
  connectable: true,
  type,
});

const initialNodes = [] as AideNode[];
const initialEdges: Edge[] = [];

const useNodeStore = create<AideState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  onNodesChange: (changes) =>
    set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onEdgesChange: (changes) =>
    set({
      edges: applyEdgeChanges(changes, get().edges),
    }),
  onConnect: (connection) =>
    set({
      edges: addEdge(connection, get().edges),
    }),
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setPrompt: (nodeId, prompt) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id === nodeId && n.type === "prompt"
          ? { ...n, data: { ...n.data, prompt } }
          : n,
      ),
    }),
  createNode: (type) => set({ nodes: [...get().nodes, deafultNode(type)] }),
}));

export { useNodeStore };
