"use server";

import { neon } from "@neondatabase/serverless";
import { currentUser } from "@clerk/nextjs/server";
import { AideError } from "@/lib/errors";
import { type Bot, BotSchema } from "./schema";

export async function get(id: string): Promise<Bot> {
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

  console.log(res);

  return BotSchema.parse(res);
}

export async function getAll(): Promise<Bot[]> {
  if (!process.env.POSTGRES_URL) throw new Error("No postgres URL provided!");
  const user = await currentUser();

  if (!user)
    throw new AideError({
      name: "EXECUTION_ERROR",
      message: "No user found",
    });

  const sql = neon(process.env.POSTGRES_URL);
  const res = await sql`
    SELECT * FROM bots 
    WHERE user_id=${user.id} 
    ORDER BY timestamp DESC
  `;

  return BotSchema.array().parse(res);
}
