import type {
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Viewport,
  Node,
} from "@xyflow/react";
import { type Model } from "@/components/flow/nodes/prompt";
import { type Workflow } from "@/app/actions/db/workflow/get";
import { type Knowledge } from "@/app/actions/db/knowledge/get";

export type NodeType = "prompt" | "db" | "APIInput" | "APIOutput";

export type AideState = {
  nodes: Node[];
  edges: Edge[];
  currentType: NodeType;
  workflow: Workflow;
  viewport: Viewport;
  isWorkflowLoading: boolean;
  knowledgeBases: Knowledge[];
  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setModel: (nodeId: string, model: Model) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setPrompt: (nodeId: string, prompt: string) => void;
  setDb: (nodeId: string, data: { name: string; id: string }) => void;
  setWorkflow: (w: Workflow) => void;
  createNode: (type: NodeType, position?: { x: number; y: number }) => void;
  setViewport: (v: Viewport) => void;
  setCurrentType: (t: NodeType) => void;
  setAPINodeName: (nodeId: string, name: string) => void;
  setIsWorkflowLoading: (isLoading: boolean) => void;
  setKnowledgeBases: (knowledgeBases: Knowledge[]) => void;
  debugLog: () => void;
};
