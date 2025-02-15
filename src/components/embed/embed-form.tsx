"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { embed } from "@/app/actions/llm/embed";
import { Copy } from "lucide-react";
import { toast } from "react-hot-toast";

export default function EmbedForm() {
  const [text, setText] = useState("");
  const [embedding, setEmbedding] = useState<number[] | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await embed(text);
    setEmbedding(result.embedding);
  };

  const copyToClipboard = async () => {
    if (embedding) {
      await navigator.clipboard.writeText(JSON.stringify(embedding));
      toast.success("Copied to clipboard");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to embed..."
        className="min-h-[200px]"
      />
      <Button type="submit">Generate Embedding</Button>
      {embedding && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Embedding Result:</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              type="button"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
          </div>
          <pre className="max-h-[200px] overflow-auto rounded-lg bg-muted p-4">
            {JSON.stringify(embedding, null, 2)}
          </pre>
        </div>
      )}
    </form>
  );
}
