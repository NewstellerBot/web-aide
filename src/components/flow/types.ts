import type {
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Viewport,
  Node,
} from "@xyflow/react";
import { type Model } from "@/components/flow/nodes/prompt";

export type NodeType = "prompt" | "db";

export type AideState = {
  nodes: Node[];
  edges: Edge[];
  currentType: NodeType;
  workflow: string;
  viewport: Viewport;
  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setModel: (nodeId: string, model: Model) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setPrompt: (nodeId: string, prompt: string) => void;
  setWorkflow: (w: string) => void;
  createNode: (type: NodeType, position?: { x: number; y: number }) => void;
  setViewport: (v: Viewport) => void;
  setCurrentType: (t: NodeType) => void;
  setDbType: (nodeId: string, t: "string") => void;
};
