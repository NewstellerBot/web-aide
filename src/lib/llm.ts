import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { type Model } from "@/components/flow/nodes/prompt";

class LLM {
  private openai: OpenAI;
  private anthropic: Anthropic;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private chunk: any;

  constructor() {
    if (!process.env.OPENAI_API_KEY)
      throw new Error("No openai api key provided");
    if (!process.env.ANTHROPIC_API_KEY)
      throw new Error("No anthropic api key provided");
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.anthropic = new Anthropic({ apiKey: process.env.OPENAI_API_KEY });
  }

  async stream(prompt: string, model: Model) {
    switch (model) {
      case "openai":
        return (
          await this.openai.chat.completions.create({
            model: "chatgpt-4o-latest",
            messages: [{ role: "user", content: prompt }],
            stream: false,
          })
        ).choices[0]?.message;
      case "claude":
        return (
          await this.anthropic.messages.create({
            model: "claude-3-5-sonnet-latest",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1024,
          })
        ).content;
    }
  }
}
