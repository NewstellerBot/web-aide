import { type Node } from "@/app/actions/db/workflow/get";

export const adjustBotNodes = (nodes: Node[]): Node[] => {
  // keep track of the output numbers
  let counter = 0;
  // map nodes
  return nodes.map((node) => {
    switch (node.type) {
      case "botInput":
        return { ...node, type: "APIInput", data: { name: "botInput" } };
      case "botOutput":
        return {
          ...node,
          type: "APIOutput",
          data: { name: `botOutput${counter++}` },
        };
      default:
        return node;
    }
  });
};
