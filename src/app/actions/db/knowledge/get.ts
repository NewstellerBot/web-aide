"use server";

import { neon } from "@neondatabase/serverless";
import { currentUser } from "@clerk/nextjs/server";

import { AideError } from "@/lib/errors";
import { z } from "zod";

const knowledgeBaseSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
});

export type Knowledge = z.infer<typeof knowledgeBaseSchema>;

const knowledgebasesSchema = knowledgeBaseSchema.array();

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
    await sql`SELECT * FROM knowledge WHERE user_id=${user.id} ORDER BY timestamp DESC;`;

  return knowledgebasesSchema.parse(res);
}
