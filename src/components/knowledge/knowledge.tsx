import FilesDrop from "@/components/knowledge/upload";
import FilesTable from "@/components/knowledge/table";
import Preview from "@/components/knowledge/preview";
import { getWithItems } from "@/app/actions/db/knowledge/get";

export default async function Knowledge({ id }: { id: string }) {
  const knowledgeBase = await getWithItems(id);
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
