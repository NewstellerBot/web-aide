import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type KnowledgeWithItems } from "@/app/actions/db/knowledge/get";

export default function FilesTable({
  knowledgeBase,
}: {
  knowledgeBase: KnowledgeWithItems;
}) {
  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document Name</TableHead>
            <TableHead>Upload Date</TableHead>
            <TableHead>Token Count</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {knowledgeBase.items.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell>{doc.name}</TableCell>
              <TableCell>{doc.timestamp.toLocaleString()}</TableCell>
              <TableCell>{doc?.tokenCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
