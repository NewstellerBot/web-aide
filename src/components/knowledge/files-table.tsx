"use client";

import { useShallow } from "zustand/react/shallow";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  useKnowledgeStore,
  type KnowledgeState,
} from "@/components/knowledge/store";

const selector = (state: KnowledgeState) => ({
  documents: state.documents,
  setSelectedDoc: state.setSelectedDoc,
});

export default function FilesTable() {
  const { documents, setSelectedDoc } = useKnowledgeStore(useShallow(selector));
  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document Name</TableHead>
            <TableHead>Upload Date</TableHead>
            <TableHead>Token Count</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell>{doc.name}</TableCell>
              <TableCell>{doc.uploadedAt.toLocaleString()}</TableCell>
              <TableCell>{doc.tokenCount}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDoc(doc)}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
