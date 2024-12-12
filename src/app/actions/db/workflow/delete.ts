"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

import { currentUser } from "@clerk/nextjs/server";
import { AideError } from "@/lib/errors";

export async function deleteWorkflow(workflowId: string) {
  if (!process.env.POSTGRES_URL) throw new Error("No postgres URL provided!");

  try {
    const sql = neon(process.env.POSTGRES_URL);
    const user = await currentUser();

    if (!user)
      throw new AideError({
        name: "EXECUTION_ERROR",
        message: "No user found",
      });

    const res =
      await sql`DELETE FROM workflows WHERE id=${workflowId} AND user_id=${user.id};`;
    revalidatePath("/app");
    return res;
  } catch (e) {
    console.error("Error deleting nodes:", e);
  }
}
