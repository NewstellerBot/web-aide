"use server";

import { neon } from "@neondatabase/serverless";
import { currentUser } from "@clerk/nextjs/server";

import { AideError } from "@/lib/errors";
import { z } from "zod";

const knowledgeBaseSchema = z
  .object({
    id: z.string().min(1),
    name: z.string(),
    user_id: z.string(),
    timestamp: z.union([
      z.string().transform((str) => new Date(str)),
      z.date(),
    ]),
  })
  .transform((data) => ({
    id: data.id,
    name: data.name,
    userId: data.user_id,
    timestamp: data.timestamp,
  }));

export type Knowledge = z.infer<typeof knowledgeBaseSchema>;

const knowledgeBasesSchema = knowledgeBaseSchema.array();

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

  return knowledgeBasesSchema.parse(res);
}

// Add this schema for items
const itemSchema = z
  .object({
    id: z.string().min(1),
    name: z.string(),
    timestamp: z.union([
      z.string().transform((str) => new Date(str)),
      z.date(),
    ]),
    token_count: z.number().optional(),
    s3_key: z.string().optional(),
    knowledge_id: z.string().optional(),
    processing: z.boolean().optional(),
    embedding: z.number().array().optional(),
  })
  .transform((data) => ({
    id: data.id,
    name: data.name,
    timestamp: data.timestamp,
    tokenCount: data.token_count,
    s3Key: data.s3_key,
    knowledgeId: data.knowledge_id,
    embedding: data.embedding,
  }));

const knowledgeBaseWithItemsSchema = z
  .object({
    id: z.string().min(1),
    name: z.string(),
    user_id: z.string(),
    timestamp: z.union([
      z.string().transform((str) => new Date(str)),
      z.date(),
    ]),
    items: itemSchema.array(),
  })
  .transform((data) => ({
    id: data.id,
    name: data.name,
    userId: data.user_id,
    timestamp: data.timestamp,
    items: data.items,
  }));

export type KnowledgeWithItems = z.infer<typeof knowledgeBaseWithItemsSchema>;

export async function get(id: string) {
  if (!process.env.POSTGRES_URL) throw new Error("No postgres URL provided!");
  const user = await currentUser();

  if (!user)
    throw new AideError({
      name: "EXECUTION_ERROR",
      message: "No user found",
    });

  const sql = neon(process.env.POSTGRES_URL);
  const [res] = await sql`
    SELECT * FROM knowledge 
    WHERE id=${id} AND user_id=${user.id}
    LIMIT 1
  `;

  if (!res) {
    throw new AideError({
      name: "NOT_FOUND",
      message: "Knowledge base not found",
    });
  }

  return knowledgeBaseSchema.parse(res);
}

export async function getWithItems(id: string) {
  if (!process.env.POSTGRES_URL) throw new Error("No postgres URL provided!");
  const user = await currentUser();

  if (!user)
    throw new AideError({
      name: "EXECUTION_ERROR",
      message: "No user found",
    });

  const sql = neon(process.env.POSTGRES_URL);
  const [knowledge] = await sql`
    SELECT 
      k.*,
      COALESCE(json_agg(json_build_object(
        'id', i.id,
        'name', i.name,
        'timestamp', i.timestamp, 
        'token_count', i.token_count
      )) FILTER (WHERE i.id IS NOT NULL), '[]') as items
    FROM knowledge k
    LEFT JOIN items i ON k.id = i.knowledge_id
    WHERE k.id=${id} AND k.user_id=${user.id}
    GROUP BY k.id
  `;

  if (!knowledge) {
    throw new AideError({
      name: "NOT_FOUND",
      message: "Knowledge base not found",
    });
  }

  return knowledgeBaseWithItemsSchema.parse(knowledge);
}
