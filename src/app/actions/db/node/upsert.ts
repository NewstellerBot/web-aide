"use server";

import { neon } from "@neondatabase/serverless";
import { type Node } from "@xyflow/react";

import { currentUser } from "@clerk/nextjs/server";
import { AideError } from "@/lib/errors";

export async function updateNodes(nodes: Node[], workflowId: string) {
  if (!process.env.POSTGRES_URL) throw new Error("No postgres url provided!");
  if (!nodes || nodes.length === 0) throw new Error("No nodes to update!");

  try {
    const sql = neon(process.env.POSTGRES_URL);
    const user = await currentUser();

    if (!user)
      throw new AideError({
        name: "EXECUTION_ERROR",
        message: "No user found",
      });

    const savePromises = nodes.map((n) => {
      return sql`
        INSERT INTO nodes (id, data, workflow_id, user_id)
        VALUES
        (${n.id}, ${JSON.stringify(n)}, ${workflowId}, ${user.id})
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
