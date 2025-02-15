import FilesDrop from "@/components/knowledge/files-drop";
import FilesTable from "@/components/knowledge/files-table";
import Preview from "@/components/knowledge/preview";
import { type KnowledgeWithItems } from "@/app/actions/db/knowledge/get";

export default function Knowledge({
  id,
  knowledgeBase,
}: {
  id: string;
  knowledgeBase: KnowledgeWithItems;
}) {
  return (
    <div className="container mx-auto px-8 py-4">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Knowledge Base Documents</h1>
      </div>
      <FilesDrop knowledgeId={id} />
      <FilesTable knowledgeBase={knowledgeBase} />
      <Preview />
    </div>
  );
}
