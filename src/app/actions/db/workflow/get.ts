"use server";

import { neon } from "@neondatabase/serverless";
import { z } from "zod";

const WorkflowSchema = z.object({
  name: z.string(),
  id: z.string().uuid(),
});

const WorkflowsSchema = z.array(WorkflowSchema);

export type Workflow = z.infer<typeof WorkflowSchema>;

export async function getAll() {
  if (!process.env.POSTGRES_URL) throw new Error("No postgres URL provided!");

  const sql = neon(process.env.POSTGRES_URL);
  const res = await sql`SELECT * FROM workflows ORDER BY created_at DESC;`;
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

const EdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
});

const GetNodesResponseSchema = z.array(NodeSchema);
const GetEdgesResponseSchema = z.array(EdgeSchema);

export async function get({ id }: { id: string }) {
  if (!process.env.POSTGRES_URL) throw new Error("No postgres URL provided!");

  const sql = neon(process.env.POSTGRES_URL);

  const nodesPromise = sql`SELECT n.data AS node_data
      FROM workflows w
      LEFT JOIN nodes n ON w.id = n.workflow_id
      WHERE w.id = ${id}`;

  const edgesPromise = sql`SELECT e.id AS edge_id, e.source, e.target
                          FROM workflows w
                          LEFT JOIN edges e ON w.id = e.workflow_id
                          WHERE w.id = ${id}`;

  let [nodes, edges] = await Promise.all([nodesPromise, edgesPromise]);

  nodes = nodes.flatMap((n) => {
    if (n.node_data === null) return [];
    return {
      ...n.node_data,
    };
  });

  edges = edges.flatMap((e) => {
    if (e.edge_id === null || e.source === null || e.target === null) return [];
    return {
      id: e.edge_id,
      source: e.source,
      target: e.target,
    };
  });

  return {
    nodes: GetNodesResponseSchema.parse(nodes),
    edges: GetEdgesResponseSchema.parse(edges),
  };
}
