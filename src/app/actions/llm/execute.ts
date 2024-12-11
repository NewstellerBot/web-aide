"use server";

import type { Edge, Node } from "@xyflow/react";

import Graph, { type QueueNode } from "@/lib/algo/graph";
import Heap from "@/lib/algo/heap";
import { LLM } from "@/lib/llm";
import { type Model } from "@/components/flow/nodes/prompt";

const updateNodes = <T, U>(
  queue: Heap<QueueNode<T, U>>,
  extracted: QueueNode<T, U>,
  response: string,
) => {
  queue.heap.forEach((_, i) => {
    const deps = queue.heap[i]?.dependencies;
    const context = queue.heap[i]?.context;
    if (!deps || !context) return;

    // add response to dependent nodes' context
    if (deps.includes(extracted.id)) context.push(response);
    // remove the executed node from dependencies
    queue.heap[i]!.dependencies = queue.heap[i]!.dependencies.filter(
      (d) => d !== extracted.id,
    );
  });
};

export async function executeGraph({
  nodes,
  edges,
}: {
  nodes: Node[];
  edges: Edge[];
}) {
  const graph = new Graph(nodes, edges);
  const q = new Heap(
    graph.buildQueue(),
    (a, b) => a.dependencies.length - b.dependencies.length,
  );

  const llm = new LLM();

  let i = 0;
  let promises = [];
  while (q.heap.length > 0) {
    for (
      let node = q.peek();
      node?.dependencies.length === 0;
      node = q.peek()
    ) {
      // here we have to decide how to add more options for other types of nodes.
      const prompt = node?.data?.prompt as string;
      const model = node.data?.model as Model;
      if (!!prompt && !!model)
        promises.push({ node: node, promise: llm.generate(prompt, model) });

      q.extract();
      if (q.heap.length === 0) break;
    }

    const results = await Promise.all(promises.map((p) => p.promise));
    promises.forEach((p, i) => updateNodes(q, p.node, results[i] ?? ""));
    console.log("some results", results);

    i++;
    // create an arbitrary limit to prevent infinite loops
    if (i > 12) break;
    promises = [];
  }
}
