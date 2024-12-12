import { type Model } from "@/components/flow/nodes/prompt";
import { type QueueNode } from "@/lib/algo/graph";
import { AideError } from "@/lib/errors";

import { LLM } from "@/lib/llm";

export const prepareForExecution = (
  node: QueueNode<string, Record<string, unknown>>,
  context: Record<string, string>,
  response: Record<string, string>,
): Promise<string> => {
  const llm = new LLM({ mock: false });
  switch (node.type) {
    case "APIInput":
      return new Promise((resolve, reject) => {
        const variableName = node?.data?.name as string;
        if (!variableName)
          reject(
            new AideError({
              name: "EXECUTION_ERROR",
              message: "No variable name provided for API input node",
            }),
          );
        const fromApi = context[variableName];
        if (!fromApi)
          reject(
            new AideError({
              name: "EXECUTION_ERROR",
              message: "Incorrect request body",
            }),
          );
        else resolve(`${variableName}: ${fromApi}`);
      });

    case "prompt":
      return llm.generate(
        [node.data.prompt, ...node.context].join("\n----\n"),
        node.data.model as Model,
      );

    case "APIOutput":
      return new Promise((resolve, reject) => {
        const variableName = node?.data?.name as string;
        if (!variableName)
          reject(
            new AideError({
              name: "EXECUTION_ERROR",
              message: "No variable name provided for API output node",
            }),
          );
        const out = node?.context?.join("\n\n");
        response[variableName] = out;
        resolve(out);
      });

    default:
      throw new Error("Unknown type specified");
  }
};
