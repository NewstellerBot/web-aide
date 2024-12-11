import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Edge,
  type Node,
} from "@xyflow/react";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

import { defaultPromptNode } from "@/components/flow/nodes/prompt";
import { defaultDbNode } from "@/components/flow/nodes/db";

import type { AideState, NodeType } from "./types";

const initialNodes = [] as Node[];
const initialEdges = [] as Edge[];

const defaultNode = (type: NodeType): Node => {
  switch (type) {
    case "prompt":
      return defaultPromptNode();
    case "db":
      return defaultDbNode();
    default:
      // figure out what to do in this case; technically should never occur
      throw new Error("Unknown type specified");
  }
};

const useNodeStore = create<AideState>()(
  subscribeWithSelector((set, get) => ({
    nodes: initialNodes,
    edges: initialEdges,
    viewport: {
      x: 0,
      y: 0,
      zoom: 1,
    },
    workflow: "",
    currentType: "prompt" as NodeType,
    onNodesChange: (changes) =>
      set({ nodes: applyNodeChanges(changes, get().nodes) }),
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    setWorkflow: (workflow) => set({ workflow }),
    onConnect: (connection) =>
      set({
        edges: addEdge(connection, get().edges),
      }),
    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),
    setModel: (nodeId, model) => {
      set({
        nodes: get().nodes.map((n) =>
          n.id === nodeId && n.type === "prompt"
            ? { ...n, data: { ...n.data, model } }
            : n,
        ),
      });
    },
    setPrompt: (nodeId, prompt) =>
      set({
        nodes: get().nodes.map((n) =>
          n.id === nodeId && n.type === "prompt"
            ? { ...n, data: { ...n.data, prompt } }
            : n,
        ),
      }),
    createNode: (type, position) =>
      set({
        nodes: [
          ...get().nodes,
          { ...defaultNode(type), ...(!!position ? { position } : {}) },
        ],
      }),
    setViewport: (v) =>
      set({
        viewport: v,
      }),
    setCurrentType: (t) => set({ currentType: t }),
    setDbType: (nodeId, t) =>
      set({
        nodes: get().nodes.map((n) =>
          n.id === nodeId && n.type === "db"
            ? { ...n, data: { ...n.data, db: t } }
            : n,
        ),
      }),
  })),
);

export { useNodeStore };
