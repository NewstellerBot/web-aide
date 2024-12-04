import type { BuiltInNode, Node } from "@xyflow/react";

type LlmModel = "openai" | "claude";

export type PromptNode = Node<{
    prompt: string;
    response?: string;
    isLoading: boolean;
    model: LlmModel;
}>;

// add more dbs here
export type Db = "chroma" | "postgres" | "mysql" | "pinecone";

export type DbNode = Node<{
    db: Db;
    connectionString: string;
}>;

export type AideNode = PromptNode | BuiltInNode | DbNode;
