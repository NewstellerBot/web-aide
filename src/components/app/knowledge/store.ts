import { create } from "zustand";
import { z } from "zod";

export const DocumentSchema = z.object({
  id: z.string(),
  name: z.string(),
  timestamp: z.coerce.date(),
  tokenCount: z.number(),
  s3Key: z.string().optional(),
  s3Url: z.string().optional(),
});

export type Document = z.infer<typeof DocumentSchema>;

export type KnowledgeState = {
  documents: Document[];
  selectedDoc: Document | null;
  setSelectedDoc: (doc: Document | null) => void;
  setDocuments: (docs: Document[]) => void;
  addDocument: (doc: Document) => void;
};

export const useKnowledgeStore = create<KnowledgeState>((set) => ({
  documents: [],
  selectedDoc: null,
  setSelectedDoc: (doc) => set({ selectedDoc: doc }),
  setDocuments: (docs) => set({ documents: docs }),
  addDocument: (doc) =>
    set((state) => ({ documents: [...state.documents, doc] })),
}));
