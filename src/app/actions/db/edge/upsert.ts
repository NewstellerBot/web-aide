"use server";

import { neon } from "@neondatabase/serverless";
import { type Edge } from "@xyflow/react";

export async function upsertEdges(edges: Edge[], workflowId: string) {
  if (!process.env.POSTGRES_URL) throw new Error("No postgres url provided!");
  if (!edges || edges.length === 0) throw new Error("No edges to update!");

  try {
    const sql = neon(process.env.POSTGRES_URL);
    const savePromises = edges.map((edge) => {
      return sql`
        INSERT INTO edges (id, source, target, workflow_id)
        VALUES
        (${edge.id}, ${edge.source}, ${edge.target}, ${workflowId})
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
