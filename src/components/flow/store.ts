import {
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    type Edge,
} from "@xyflow/react";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { v4 as uuid } from "uuid";

import { debounce } from "@/lib/utils";
import { updateNodes } from "@/app/actions/nodes";

import type { AideState, NodeType } from "./types";
import type { PromptNode, DbNode, AideNode } from "./nodes/types";


const deafultNode = (
    type: NodeType,
    position?: { x: number; y: number },
): PromptNode => ({
    id: uuid(),
    position: position ?? { x: 50, y: 50 },
    data: {
        prompt: "",
        isLoading: false,
        model: "openai",
    },
    connectable: true,
    type,
});

const initialNodes = [] as AideNode[];
const initialEdges: Edge[] = [];

const useNodeStore = create<AideState>()(
    subscribeWithSelector((set, get) => ({
        nodes: initialNodes,
        edges: initialEdges,
        viewport: {
            x: 0,
            y: 0,
            zoom: 1,
        },
        currentType: "default",
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
                        ? { ...n, data: { ...n.data, prompt } } as PromptNode
                        : n,
                ),
            }),
        createNode: (type, position) =>
            set({
                nodes: [
                    ...get().nodes,
                    { ...deafultNode(type), ...(!!position ? { position } : {}) },
                ],
            }),
        setViewport: (v) =>
            set({
                viewport: v,
            }),
        setCurrentType: (t) => set({ currentType: t }),
        setDbType: (nodeId, t) => set({
            nodes: get().nodes.map((n) =>
                n.id === nodeId && n.type === "db"
                    ? { ...n, data: { ...n.data, db: t } } as DbNode
                    : n,
            )
        })
    })))



const updateDiff = async (oldNodes: AideNode[], newNodes: AideNode[]) => {
    const nodesForUpdate = oldNodes.flatMap((old, idx) => (old === newNodes[idx] ? [] : newNodes[idx])).filter(x => !!x)
    if (!nodesForUpdate) return
    return await updateNodes(nodesForUpdate)
}

useNodeStore.subscribe((state) => state.nodes, debounce(200, updateDiff));

export { useNodeStore };
