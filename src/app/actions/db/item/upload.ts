"use server";

import { neon } from "@neondatabase/serverless";
import { currentUser } from "@clerk/nextjs/server";

import { AideError } from "@/lib/errors";

export async function upsertItem({
  items,
  knowledgeId,
}: {
  items: {}[];
  knowledgeId: string;
}) {
  if (!process.env.POSTGRES_URL) throw new Error("No postgres url provided!");
  if (!items || items.length === 0) throw new Error("No edges to update!");

  try {
    const sql = neon(process.env.POSTGRES_URL);
    const user = await currentUser();

    if (!user)
      throw new AideError({
        name: "EXECUTION_ERROR",
        message: "No user found",
      });
    const savePromises = items.map((item) => {
      return sql`
        INSERT INTO items (knowledge_id, embedding)
        VALUES
        (${knowledgeId}, ${item.embedding})
        `;
    });

    return await Promise.all(savePromises);
  } catch (e) {
    // TODO: add better error handling
    console.error(e);
  }
}
