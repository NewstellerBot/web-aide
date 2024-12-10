import { type Node, type Edge } from "@xyflow/react";
import { upsertEdges } from "@/app/actions/db/edge/upsert";
import { deleteEdges } from "@/app/actions/db/edge/delete";
import { updateNodes } from "@/app/actions/db/node/upsert";
import { deleteNodes } from "@/app/actions/db/node/delete";

export function computeChanges<T extends { id: string }>(
  newItems: T[],
  oldItems: T[],
  isEqual: (a: T, b: T) => boolean,
): { upsertItems: T[]; deleteItems: T[] } {
  const upsertItems: T[] = [];
  const deleteItems: T[] = [];

  const oldItemsMap = new Map<string, T>(
    oldItems.map((item) => [item.id, item]),
  );
  const newItemsMap = new Map<string, T>(
    newItems.map((item) => [item.id, item]),
  );

  for (const newItem of newItems) {
    const oldItem = oldItemsMap.get(newItem.id);
    if (!oldItem || !isEqual(newItem, oldItem)) {
      upsertItems.push(newItem);
    }
  }
  for (const oldItem of oldItems) {
    if (!newItemsMap.has(oldItem.id)) {
      deleteItems.push(oldItem);
    }
  }

  return { upsertItems, deleteItems };
}

export const updateEdgeDiff = async (
  data: { edges: Edge[]; workflow: string },
  oldData: { edges: Edge[] },
) => {
  const { edges, workflow: workflowId } = data;
  const { edges: oldEdges } = oldData;
  const { upsertItems: toUpsert, deleteItems: toDelete } = computeChanges(
    edges,
    oldEdges,
    (a, b) => a === b,
  );

  console.log("to update edges", toUpsert, toDelete);
  return await Promise.allSettled([
    toUpsert.length > 0 && upsertEdges(toUpsert, workflowId),
    toDelete.length > 0 && deleteEdges(toDelete),
  ]);
};

export const updateNodeDiff = async (
  data: { nodes: Node[]; workflow: string },
  oldData: { nodes: Node[] },
) => {
  const { nodes, workflow } = data;
  const { nodes: oldNodes } = oldData;
  const { upsertItems: toUpsert, deleteItems: toDelete } = computeChanges(
    nodes,
    oldNodes,
    (a, b) => a === b,
  );
  return await Promise.allSettled([
    toUpsert.length > 0 && updateNodes(toUpsert, workflow),
    toDelete.length > 0 && deleteNodes(toDelete),
  ]);
};
