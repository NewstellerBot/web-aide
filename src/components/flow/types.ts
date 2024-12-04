import type {
    Edge,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    Viewport,
} from "@xyflow/react";
import type { AideNode, Db } from "@/components/flow/nodes/types";

export type NodeType = "default" | "prompt" | "db";

export type AideState = {
    nodes: AideNode[];
    edges: Edge[];
    currentType: NodeType;
    viewport: Viewport;
    onNodesChange: OnNodesChange<AideNode>;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    setNodes: (nodes: AideNode[]) => void;
    setEdges: (edges: Edge[]) => void;
    setPrompt: (nodeId: string, prompt: string) => void;
    createNode: (type: NodeType, position?: { x: number; y: number }) => void;
    setViewport: (v: Viewport) => void;
    setCurrentType: (t: NodeType) => void;
    setDbType: (nodeId: string, t: Db) => void;
};
