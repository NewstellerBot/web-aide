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

export const updateEdgeDiff = async (edges: Edge[], oldEdges: Edge[]) => {
  const { upsertItems: toUpsert, deleteItems: toDelete } = computeChanges(
    edges,
    oldEdges,
    (a, b) => a === b,
  );

  console.log("to update edges", toUpsert, toDelete);
  return await Promise.allSettled([
    toUpsert.length > 0 && upsertEdges(toUpsert),
    toDelete.length > 0 && deleteEdges(toDelete),
  ]);
};

export const updateNodeDiff = async (nodes: Node[], oldNodes: Node[]) => {
  const { upsertItems: toUpsert, deleteItems: toDelete } = computeChanges(
    nodes,
    oldNodes,
    (a, b) => a === b,
  );
  return await Promise.allSettled([
    toUpsert.length > 0 && updateNodes(toUpsert),
    toDelete.length > 0 && deleteNodes(toDelete),
  ]);
};
