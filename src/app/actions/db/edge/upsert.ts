"use server";

import { neon } from "@neondatabase/serverless";
import { type Edge } from "@xyflow/react";
import { currentUser } from "@clerk/nextjs/server";
import { AideError } from "@/lib/errors";

export async function upsertEdges(edges: Edge[], workflowId: string) {
  if (!process.env.POSTGRES_URL) throw new Error("No postgres url provided!");
  if (!edges || edges.length === 0) throw new Error("No edges to update!");

  try {
    const sql = neon(process.env.POSTGRES_URL);
    const user = await currentUser();

    if (!user)
      throw new AideError({
        name: "EXECUTION_ERROR",
        message: "No user found",
      });
    const savePromises = edges.map((edge) => {
      return sql`
        INSERT INTO edges (id, source, target, workflow_id, user_id)
        VALUES
        (${edge.id}, ${edge.source}, ${edge.target}, ${workflowId}, ${user.id})
        ON CONFLICT (id)
        DO UPDATE SET
            source = EXCLUDED.source,
            target = EXCLUDED.target,
            workflow_id = EXCLUDED.workflow_id
        `;
    });

    return await Promise.all(savePromises);
  } catch (e) {
    // TODO: add better error handling
    console.error(e);
  }
}
