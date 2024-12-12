"use server";

import { AideError } from "@/lib/errors";
import { neon } from "@neondatabase/serverless";
import { z } from "zod";

import { currentUser } from "@clerk/nextjs/server";

const WorkflowSchema = z.object({
  name: z.string(),
  id: z.string().uuid(),
});

const WorkflowsSchema = z.array(WorkflowSchema);

export type Workflow = z.infer<typeof WorkflowSchema>;

export async function getAll() {
  if (!process.env.POSTGRES_URL) throw new Error("No postgres URL provided!");
  const user = await currentUser();

  if (!user)
    throw new AideError({
      name: "EXECUTION_ERROR",
      message: "No user found",
    });

  const sql = neon(process.env.POSTGRES_URL);
  const res =
    await sql`SELECT * FROM workflows WHERE user_id=${user.id} ORDER BY created_at DESC;`;
  return WorkflowsSchema.parse(res);
}

const NodeSchema = z.object({
  id: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  selected: z.boolean().optional(),
  data: z.record(z.any(), z.any()),
  type: z.string(),
});
type Node = z.infer<typeof NodeSchema>;

const EdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
});
type Edge = z.infer<typeof EdgeSchema>;

const GetNodesResponseSchema = z.array(NodeSchema);
const GetEdgesResponseSchema = z.array(EdgeSchema);

export async function get({ id }: { id: string }) {
  if (!process.env.POSTGRES_URL) throw new Error("No postgres URL provided!");

  try {
    const sql = neon(process.env.POSTGRES_URL);
    const user = await currentUser();

    if (!user)
      throw new AideError({
        name: "EXECUTION_ERROR",
        message: "No user found",
      });

    const workflow =
      await sql`SELECT * FROM workflows WHERE id = ${id} AND user_id = ${user.id}`;
    if (!workflow || workflow.length === 0 || !workflow[0]?.id)
      throw new AideError({ name: "DB_ERROR", message: "Workflow not found." });

    const nodesPromise = sql`SELECT n.data AS node_data
      FROM workflows w
      LEFT JOIN nodes n ON w.id = n.workflow_id
      WHERE w.id = ${id} and w.user_id = ${user.id}`;

    const edgesPromise = sql`SELECT e.id AS edge_id, e.source, e.target
                          FROM workflows w
                          LEFT JOIN edges e ON w.id = e.workflow_id
                          WHERE w.id = ${id} and w.user_id = ${user.id}`;

    const [nodes, edges] = await Promise.all([nodesPromise, edgesPromise]);

    const formattedNodes = nodes.flatMap((n) => {
      if (n.node_data === null) return [];
      return n.node_data as Node;
    });

    const formattedEdges = edges.flatMap((e) => {
      const { edge_id, source, target } = e;
      if (!edge_id || !source || !target) return [];
      return {
        id: edge_id as Edge["id"],
        source: source as Edge["source"],
        target: target as Edge["target"],
      } as Edge;
    });

    return {
      nodes: GetNodesResponseSchema.parse(formattedNodes),
      edges: GetEdgesResponseSchema.parse(formattedEdges),
    };
  } catch (e) {
    throw new AideError({
      name: "DB_ERROR",
      message: "Failed to retrieve workflow from db.",
      cause: e,
    });
  }
}
