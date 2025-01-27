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
import { defaultInputNode } from "@/components/flow/nodes/input";
import { defaultOutputNode } from "@/components/flow/nodes/output";

import type { AideState, NodeType } from "./types";

const initialNodes = [] as Node[];
const initialEdges = [] as Edge[];

const defaultNode = (type: NodeType): Node => {
  switch (type) {
    case "prompt":
      return defaultPromptNode();
    case "db":
      return defaultDbNode();
    case "APIInput":
      return defaultInputNode();
    case "APIOutput":
      return defaultOutputNode();
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
    workflow: { name: "", id: "" },
    currentType: "prompt" as NodeType,
    isWorkflowLoading: false,
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
    setAPINodeName: (nodeId, name) =>
      set({
        nodes: get().nodes.map((n) => {
          console.log(nodeId, n.id, n.type);
          return n.id === nodeId &&
            (n.type === "APIInput" || n.type === "APIOutput")
            ? { ...n, data: { ...n.data, name } }
            : n;
        }),
      }),
    setIsWorkflowLoading: (isLoading) => set({ isWorkflowLoading: isLoading }),
  })),
);

const defaultStoreValues = () => ({
  nodes: initialNodes,
  edges: initialEdges,
  workflow: { name: "", id: "" },
  viewport: {
    x: 0,
    y: 0,
    zoom: 1,
  },
  isWorkflowLoading: false,
});

export { useNodeStore, defaultStoreValues };
