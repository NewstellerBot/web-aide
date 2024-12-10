"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export async function upsert({
  name,
  id,
}: {
  name: string;
  id: string | undefined;
}) {
  if (!process.env.POSTGRES_URL) throw new Error("No postgres URL provided!");

  const sql = neon(process.env.POSTGRES_URL);
  let res;
  if (!id) {
    res = await sql`
    INSERT INTO workflows (name) VALUES (${name})
    RETURNING id, name;
    `;
  } else {
    res = await sql`
    INSERT INTO workflows (id, name) VALUES (${id}, ${name})
    ON CONFLICT (id)
    DO UPDATE SET
    name = EXCLUDED.name
    RETURNING id, name;
    `;
  }

  // Check if returning type is array
  // Since id is unique, just select the only element
  if (Array.isArray(res)) res = res[0];

  revalidatePath("/app", "page");

  return ResponseSchema.parse(res);
}
