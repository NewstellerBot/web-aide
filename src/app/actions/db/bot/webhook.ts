"use server";

import { neon } from "@neondatabase/serverless";
import { currentUser } from "@clerk/nextjs/server";
import { AideError } from "@/lib/errors";
import fetch from "node-fetch";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const responseSchema = z.object({
  ok: z.boolean(),
  error_code: z.number().optional(),
  description: z.string().optional(),
});

export async function setWebhook(
  botId: string,
  webhookUrl: string,
  force = false,
): Promise<{ hasExistingFlow: boolean }> {
  if (!process.env.POSTGRES_URL) throw new Error("No postgres URL provided!");
  const user = await currentUser();

  if (!user)
    throw new AideError({
      name: "EXECUTION_ERROR",
      message: "No user found",
    });

  const sql = neon(process.env.POSTGRES_URL);

  // Get bot's access token
  const [bot] = await sql`
    SELECT access_token, workflow_id 
    FROM bots 
    WHERE id = ${botId} AND user_id = ${user.id}
  `;

  if (!bot) {
    throw new AideError({
      name: "EXECUTION_ERROR",
      message: "Bot not found",
    });
  }

  const token = (bot as { access_token: string; workflow_id: string | null })
    .access_token;
  const existingWorkflowId = (
    bot as { access_token: string; workflow_id: string | null }
  ).workflow_id;

  if (existingWorkflowId && !force) {
    return { hasExistingFlow: true };
  }

  // Send request to Telegram API
  const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: webhookUrl,
    }),
  });

  if (!res.ok) {
    throw new AideError({
      name: "EXECUTION_ERROR",
      message: "Telegram API error",
      cause: res.body,
    });
  }

  const response = responseSchema.parse(JSON.parse(res.body.read().toString()));

  if (!response.ok) {
    throw new AideError({
      name: "EXECUTION_ERROR",
      message: response.description ?? "Failed to set webhook",
    });
  }

  // Update webhook URL in database
  await sql`
    UPDATE bots 
    SET webhook_url = ${webhookUrl}
    WHERE id = ${botId} AND user_id = ${user.id}
  `;

  revalidatePath("/app");
  return { hasExistingFlow: false };
}
