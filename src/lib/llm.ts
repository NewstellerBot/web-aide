import OpenAI from "openai";

import { env } from "@/env";
import Anthropic from "@anthropic-ai/sdk";
import { type Model } from "@/components/flow/nodes/prompt";
import { AideError } from "./errors";

export class LLM {
  private openai: OpenAI;
  private anthropic: Anthropic;
  private mock = false;

  constructor({ mock }: { mock?: boolean } = {}) {
    if (!env.OPENAI_API_KEY) throw new Error("No openai api key provided");
    if (!env.ANTHROPIC_API_KEY)
      throw new Error("No anthropic api key provided");
    this.openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
    this.anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
    if (mock) this.mock = mock;
  }

  async generate(prompt: string, model: Model) {
    if (this.mock) return { response: "mocked response", tokens: 0 };
    return this._generate(prompt, model);
  }

  private async _generate(prompt: string, model: Model) {
    switch (model) {
      case "openai":
        const openai_response = await this.openai.chat.completions.create({
          model: "chatgpt-4o-latest",
          messages: [{ role: "user", content: prompt }],
          stream: false,
        });

        return {
          response:
            openai_response.choices[0]?.message?.content ??
            "Could not get an answer from OpenAI",
          tokens: openai_response.usage?.total_tokens ?? 0,
        };

      case "claude":
        const claude_response = await this.anthropic.messages.create({
          model: "claude-3-5-sonnet-latest",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 512,
        });

        return {
          response: claude_response.content
            .flatMap((c) => (c.type === "text" ? c.text : []))
            .join(""),
          tokens:
            claude_response.usage.input_tokens +
            claude_response.usage.output_tokens,
        };
    }
  }
}

export class Embeddings {
  private openai: OpenAI;
  private mock = false;
  private readonly CHUNK_SIZE = 8000;
  private readonly CHUNK_OVERLAP = 200; // Number of characters to overlap between chunks

  constructor({ mock }: { mock?: boolean } = {}) {
    if (!env.OPENAI_API_KEY) throw new Error("No openai api key provided");
    this.openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
    if (mock) this.mock = mock;
  }
  async generate(
    prompt: string,
  ): Promise<{ embedding: number[]; tokens: number }> {
    if (this.mock)
      return {
        embedding: Array(1536)
          .fill(0)
          .map(() => Math.random()),
        tokens: 0,
      };
    return this._generate(prompt);
  }
  private async _generate(prompt: string) {
    const openai_response = await this.openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: prompt,
    });

    const embedding = openai_response.data[0]?.embedding;
    const tokens = openai_response.usage?.total_tokens;

    if (!embedding)
      throw new AideError({
        name: "SERVER_ERROR",
        message: "Could not get embeddings from OpenAI",
      });

    return {
      embedding,
      tokens,
    };
  }
  public chunkText(
    text: string,
  ): { chunk: string; startIndex: number; endIndex: number }[] {
    const words = text.split(" ");
    const chunks: { chunk: string; startIndex: number; endIndex: number }[] =
      [];
    let currentChunk: string[] = [];
    let currentLength = 0;
    let currentStartIndex = 0;

    for (const word of words) {
      if (currentLength + word.length > this.CHUNK_SIZE) {
        const chunk = currentChunk.join(" ");
        chunks.push({
          chunk,
          startIndex: currentStartIndex,
          endIndex: currentStartIndex + chunk.length,
        });
        currentStartIndex = currentStartIndex + chunk.length;
        currentChunk = [word];
        currentLength = word.length;
      } else {
        currentChunk.push(word);
        currentLength += word.length + 1;
      }
    }

    if (currentChunk.length > 0) {
      const chunk = currentChunk.join(" ");
      chunks.push({
        chunk,
        startIndex: currentStartIndex,
        endIndex: currentStartIndex + chunk.length,
      });
    }

    return chunks;
  }
}
