"use server";

import type { Edge, Node } from "@xyflow/react";

import Graph, { type QueueNode } from "@/lib/algo/graph";
import Heap from "@/lib/algo/heap";
import { prepareForExecution } from "@/app/actions/llm/utils";
import { AideError } from "@/lib/errors";

const MAX_DEPTH_LIMIT = 15;

const updateNodes = <T, U>(
  queue: Heap<QueueNode<T, U>>,
  extracted: QueueNode<T, U>,
  response: string,
) => {
  queue.heap.forEach((_, i) => {
    const deps = queue.heap[i]?.dependencies;
    const context = queue.heap[i]?.context;

    if (!deps || !context) throw new Error("Invalid queue node");
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
  context = {},
  response = {},
}: {
  nodes: Node[];
  edges: Edge[];
  context?: Record<string, string>;
  response?: Record<string, string>;
}) {
  const graph = new Graph(nodes, edges);
  if (graph.isCyclical())
    throw new AideError({
      name: "EXECUTION_ERROR",
      message: "Graph is cyclical",
    });
  const q = new Heap(
    graph.buildQueue(),
    (
      a: QueueNode<string, Record<string, unknown>>,
      b: QueueNode<string, Record<string, unknown>>,
    ) => a.dependencies.length - b.dependencies.length,
  );

  let i = 0;
  let promises = [];
  while (q.heap.length > 0) {
    for (
      let node = q.peek();
      node?.dependencies.length === 0;
      node = q.peek()
    ) {
      promises.push({
        node: node,
        promise: prepareForExecution(node, context, response),
      });

      q.pop();
      if (q.heap.length === 0) break;
    }

    const results = await Promise.all(promises.map((p) => p.promise));
    promises.forEach((p, i) => updateNodes(q, p.node, results[i] ?? ""));

    i++;
    // create an arbitrary limit to prevent infinite loops
    if (i > MAX_DEPTH_LIMIT)
      throw new AideError({
        name: "LLM_ERROR",
        message: "Max depth limit reached",
      });
    promises = [];

    // sort heap again
    for (let i = Math.floor(q.heap.length); i >= 0; --i) {
      q.heapify(i);
    }
  }

  return response;
}
