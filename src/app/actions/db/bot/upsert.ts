"use server";

import { neon } from "@neondatabase/serverless";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { type Bot } from "./schema";
import { AideError } from "@/lib/errors";
import fetch from "node-fetch";
import { z } from "zod";

const responseSchema = z.object({
  ok: z.boolean(),
  error_code: z.number().optional(),
  description: z.string().optional(),
});

function capitalizeFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

const setBotProperty = async (
  value: string,
  token: string,
  property: "name" | "description",
) => {
  const res = await fetch(
    `https://api.telegram.org/bot${token}/setMy${capitalizeFirstLetter(property)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        [property]: value,
      }),
    },
  );

  if (!res.ok)
    throw new AideError({
      name: "EXECUTION_ERROR",
      message: "Telegram API error",
      cause: res.body,
    });

  return responseSchema.parse(JSON.parse(res.body.read().toString()));
};

export async function create(name: string, token: string): Promise<void> {
  try {
    if (!process.env.POSTGRES_URL) throw new Error("No postgres URL provided!");
    const user = await currentUser();

    if (!user)
      throw new AideError({
        name: "EXECUTION_ERROR",
        message: "No user found",
      });

    await setBotProperty(name, token, "name");
    const sql = neon(process.env.POSTGRES_URL);
    await sql`
      INSERT INTO bots (name, user_id, access_token)
      VALUES (${name}, ${user.id}, ${token})
      `;
    revalidatePath("/app", "layout");
  } catch (error) {
    console.error(`[create bot]: `, error);
    throw error;
  }
}

export async function upsert(bot: Omit<Bot, "timestamp" & "id">) {
  if (!process.env.POSTGRES_URL) throw new Error("No postgres URL provided!");
  const user = await currentUser();

  if (!user)
    throw new AideError({
      name: "EXECUTION_ERROR",
      message: "No user found",
    });

  const sql = neon(process.env.POSTGRES_URL);
  let token: string;
  if (!bot.access_token) {
    const [res] =
      await sql`SELECT access_token FROM bots WHERE user_id = ${user.id} AND id = ${bot.id}`;
    token = (res as { access_token: string }).access_token;
  } else {
    token = bot.access_token;
  }

  await sql`
  INSERT INTO bots (id, name, description)
  VALUES (${bot.id}, ${bot.name}, ${bot.description})
  ON CONFLICT (id) DO UPDATE 
  SET name = ${bot.name}, description = ${bot.description}; 
  `;

  await Promise.all([
    setBotProperty(bot.name, token, "name"),
    setBotProperty(bot.description ?? "", token, "description"),
  ]);

  revalidatePath("/app", "page");
}
