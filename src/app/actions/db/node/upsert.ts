"use server";

import { neon } from "@neondatabase/serverless";
import { type Node } from "@xyflow/react";

import { currentUser } from "@clerk/nextjs/server";
import { AideError } from "@/lib/errors";

export async function updateNodes(nodes: Node[], workflowId: string) {
  if (!process.env.POSTGRES_URL) throw new Error("No postgres url provided!");
  if (!nodes || nodes.length === 0) throw new Error("No nodes to update!");
  if (!workflowId) throw new Error("No workflow ID provided!");

  try {
    const sql = neon(process.env.POSTGRES_URL);
    const user = await currentUser();

    if (!user)
      throw new AideError({
        name: "EXECUTION_ERROR",
        message: "No user found",
      });

    // First verify that the workflow exists and belongs to the user
    const workflow = await sql`
      SELECT id FROM workflows 
      WHERE id = ${workflowId} AND user_id = ${user.id}
      LIMIT 1;
    `;

    if (!workflow || workflow.length === 0) {
      throw new AideError({
        name: "EXECUTION_ERROR",
        message: "Workflow not found or access denied",
      });
    }

    const savePromises = nodes.map((n) => {
      return sql`
        INSERT INTO nodes (id, data, workflow_id, user_id)
        VALUES
        (${n.id}, ${JSON.stringify(n)}, ${workflowId}, ${user.id})
        ON CONFLICT (id)
        DO UPDATE SET
            data = EXCLUDED.data,
            workflow_id = ${workflowId};
        `;
    });

    return await Promise.all(savePromises);
  } catch (e) {
    console.error("Error updating nodes:", e);
    throw new AideError({
      name: "EXECUTION_ERROR",
      message: "Failed to update nodes",
    });
  }
}
