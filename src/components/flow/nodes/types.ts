import type { BuiltInNode, Node } from "@xyflow/react";

export type PromptNode = Node<{
  prompt: string;
  response?: string;
  isLoading: boolean;
}>;

export type AideNode = PromptNode | BuiltInNode;
