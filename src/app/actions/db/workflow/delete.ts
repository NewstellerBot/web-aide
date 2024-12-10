"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

export async function deleteWorkflow(workflowId: string) {
  if (!process.env.POSTGRES_URL) throw new Error("No postgres URL provided!");

  try {
    const sql = neon(process.env.POSTGRES_URL);
    const res = await sql`DELETE FROM workflows WHERE id=${workflowId}`;
    revalidatePath("/app");
    return res;
  } catch (e) {
    console.error("Error deleting nodes:", e);
  }
}
