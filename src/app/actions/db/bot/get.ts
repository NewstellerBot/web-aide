"use server";

import { neon } from "@neondatabase/serverless";
import { currentUser } from "@clerk/nextjs/server";
import { AideError } from "@/lib/errors";
import { type Bot, BotSchema } from "./schema";
import { z } from "zod";

export async function get(id: string): Promise<Omit<Bot, "access_token">> {
  if (!process.env.POSTGRES_URL) throw new Error("No postgres URL provided!");
  const user = await currentUser();

  if (!user)
    throw new AideError({
      name: "EXECUTION_ERROR",
      message: "No user found",
    });

  const sql = neon(process.env.POSTGRES_URL);
  const [res] = await sql`
    SELECT id, name, description
    FROM bots 
    WHERE id=${id} AND user_id=${user.id}
    LIMIT 1
  `;

  if (!res) {
    throw new AideError({
      name: "NOT_FOUND",
      message: "Bot not found",
    });
  }

  return BotSchema.omit({ access_token: true }).parse(res);
}

const getAllResponseSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    workflow_id: z.string().nullable(),
  })
  .transform(({ id, name, workflow_id }) => ({
    id,
    name,
    workflowId: workflow_id,
  }));

export type GetAllResponse = z.infer<typeof getAllResponseSchema>;

export async function getAll() {
  if (!process.env.POSTGRES_URL) throw new Error("No postgres URL provided!");
  const user = await currentUser();

  if (!user)
    throw new AideError({
      name: "EXECUTION_ERROR",
      message: "No user found",
    });

  const sql = neon(process.env.POSTGRES_URL);
  const res = await sql`
    SELECT id, name, workflow_id FROM bots 
    WHERE user_id=${user.id} 
    ORDER BY timestamp DESC
  `;

  return getAllResponseSchema.array().parse(res);
}
