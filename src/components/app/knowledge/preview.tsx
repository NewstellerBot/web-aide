"use client";

import { useShallow } from "zustand/react/shallow";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useKnowledgeStore,
  type KnowledgeState,
} from "@/components/app/knowledge/store";

const selector = (state: KnowledgeState) => ({
  documents: state.documents,
  setSelectedDoc: state.setSelectedDoc,
  selectedDoc: state.selectedDoc,
});

export default function Preview() {
  const { selectedDoc, setSelectedDoc } = useKnowledgeStore(
    useShallow(selector),
  );
  return (
    <Dialog
      open={selectedDoc !== null}
      onOpenChange={() => setSelectedDoc(null)}
    >
      <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{selectedDoc?.name}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Uploaded on: {selectedDoc?.timestamp.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">
            Token count: {selectedDoc?.tokenCount}
          </p>
          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            <p className="text-sm">Document preview will be implemented here</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
