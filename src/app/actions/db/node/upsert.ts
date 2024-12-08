"use server";

import { neon } from "@neondatabase/serverless";
import { type Node } from "@xyflow/react";

export async function updateNodes(nodes: Node[]) {
  if (!process.env.POSTGRES_URL) throw new Error("No postgres url provided!");
  if (!nodes || nodes.length === 0) throw new Error("No nodes to update!");

  try {
    const sql = neon(process.env.POSTGRES_URL);
    const savePromises = nodes.map((n) => {
      return sql`
        INSERT INTO nodes (id, data, workflow_id)
        VALUES
        (${n.id}, ${JSON.stringify(n)}, '48f37b86-9117-4066-80b4-294b14029ddc')
        ON CONFLICT (id)
        DO UPDATE SET
            data = EXCLUDED.data;
        `;
    });

    return await Promise.all(savePromises);
  } catch (e) {
    // TODO: add better error handling
    console.error(e);
  }
}