"use server";

import { Embeddings } from "@/lib/llm";

export async function embed(text: string) {
  const embeddings = new Embeddings();
  const response = await embeddings.generate(text);
  return response;
}
