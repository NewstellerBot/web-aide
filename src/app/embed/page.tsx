import EmbedForm from "@/components/embed/embed-form";

export default function EmbedPage() {
  return (
    <div className="container mx-auto px-8 py-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Text Embedding</h1>
        <p className="text-muted-foreground">
          Generate embeddings for any text
        </p>
      </div>
      <EmbedForm />
    </div>
  );
}
