import { create } from "zustand";
import { type Knowledge } from "@/app/actions/db/knowledge/get";

interface KnowledgeStore {
  knowledgeBases: Knowledge[];
  setKnowledgeBases: (knowledgeBases: Knowledge[]) => void;
}

export const useKnowledgeStore = create<KnowledgeStore>((set) => ({
  knowledgeBases: [],
  setKnowledgeBases: (knowledgeBases) => set({ knowledgeBases }),
}));