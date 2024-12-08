"use server";

import { neon } from "@neondatabase/serverless";
import { type Edge } from "@xyflow/react";

export async function deleteEdges(edges: Edge[]) {
  if (!process.env.POSTGRES_URL) throw new Error("No postgres URL provided!");
  if (!edges || edges.length === 0) throw new Error("No nodes to delete!");

  try {
    const sql = neon(process.env.POSTGRES_URL);

    const deletePromises = edges.map((edge) => {
      return sql`
        DELETE FROM edges
        WHERE id = ${edge.id};
      `;
    });

    const results = await Promise.allSettled(deletePromises);

    return results;
  } catch (e) {
    console.error("Error deleting nodes:", e);
  }
}
