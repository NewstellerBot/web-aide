import type {
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Viewport,
  Node,
} from "@xyflow/react";

export type NodeType = "prompt" | "db";

export type AideState = {
  nodes: Node[];
  edges: Edge[];
  currentType: NodeType;
  viewport: Viewport;
  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setPrompt: (nodeId: string, prompt: string) => void;
  createNode: (type: NodeType, position?: { x: number; y: number }) => void;
  setViewport: (v: Viewport) => void;
  setCurrentType: (t: NodeType) => void;
  setDbType: (nodeId: string, t: "string") => void;
};
