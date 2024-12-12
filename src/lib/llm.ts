import OpenAI from "openai";

import { env } from "@/env";
import Anthropic from "@anthropic-ai/sdk";
import { type Model } from "@/components/flow/nodes/prompt";

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
    if (this.mock) return "mocked response";
    return this._generate(prompt, model);
  }

  private async _generate(prompt: string, model: Model) {
    switch (model) {
      case "openai":
        return (
          (
            await this.openai.chat.completions.create({
              model: "chatgpt-4o-latest",
              messages: [{ role: "user", content: prompt }],
              stream: false,
            })
          ).choices[0]?.message?.content ??
          "Could not get an answer from OpenAI"
        );
      case "claude":
        return (
          await this.anthropic.messages.create({
            model: "claude-3-5-sonnet-latest",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 512,
          })
        ).content
          .flatMap((c) => (c.type === "text" ? c.text : []))
          .join("");
    }
  }
}
