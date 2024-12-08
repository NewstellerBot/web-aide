"use server";

import { neon } from "@neondatabase/serverless";
import { type Node } from "@xyflow/react";

export async function deleteNodes(nodes: Node[]) {
  if (!process.env.POSTGRES_URL) throw new Error("No postgres URL provided!");
  if (!nodes || nodes.length === 0) throw new Error("No nodes to delete!");

  try {
    const sql = neon(process.env.POSTGRES_URL);

    const deletePromises = nodes.map((n) => {
      return sql`
        DELETE FROM nodes
        WHERE id = ${n.id};
      `;
    });

    const results = await Promise.allSettled(deletePromises);

    return results;
  } catch (e) {
    console.error("Error deleting nodes:", e);
  }
}
