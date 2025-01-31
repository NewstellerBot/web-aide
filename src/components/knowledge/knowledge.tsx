import FilesDrop from "@/components/knowledge/files-drop";
import FilesTable from "@/components/knowledge/files-table";
import Preview from "@/components/knowledge/preview";

export default function Knowledge() {
  return (
    <div className="container mx-auto px-8 py-4">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Knowledge Base Documents</h1>
      </div>
      <FilesDrop />
      <FilesTable />
      <Preview />
    </div>
  );
}
