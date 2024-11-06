import type {
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from "@xyflow/react";
import { type AideNode } from "@/components/flow/nodes/types";

export type NodeType = "prompt" | "builtin";

export type AideState = {
  nodes: AideNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange<AideNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: AideNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  setPrompt: (nodeId: string, prompt: string) => void;
  createNode: (type: NodeType) => void;
};
