"use server";

import { neon } from "@neondatabase/serverless";
import { z } from "zod";

const WorkflowsSchema = z.array(
  z.object({
    name: z.string(),
    id: z.string().uuid(),
  }),
);

export async function getAll() {
  if (!process.env.POSTGRES_URL) throw new Error("No postgres URL provided!");

  const sql = neon(process.env.POSTGRES_URL);
  const res = await sql`SELECT * FROM workflows;`;
  return WorkflowsSchema.parse(res);
}
