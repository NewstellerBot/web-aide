"use server";

import { neon } from "@neondatabase/serverless";
import { type Edge } from "@xyflow/react";
import { currentUser } from "@clerk/nextjs/server";
import { AideError } from "@/lib/errors";

export async function deleteEdges(edges: Edge[]) {
  if (!process.env.POSTGRES_URL) throw new Error("No postgres URL provided!");
  if (!edges || edges.length === 0) throw new Error("No nodes to delete!");

  try {
    const sql = neon(process.env.POSTGRES_URL);
    const user = await currentUser();

    if (!user)
      throw new AideError({
        name: "EXECUTION_ERROR",
        message: "No user found",
      });

    const deletePromises = edges.map((edge) => {
      return sql`
        DELETE FROM edges
        WHERE id = ${edge.id} AND user_id = ${user.id};
      `;
    });

    const results = await Promise.allSettled(deletePromises);

    return results;
  } catch (e) {
    console.error("Error deleting nodes:", e);
  }
}
