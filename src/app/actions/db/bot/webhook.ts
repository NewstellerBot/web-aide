"use server";

import { neon } from "@neondatabase/serverless";
import { currentUser } from "@clerk/nextjs/server";
import { AideError } from "@/lib/errors";
import fetch from "node-fetch";
import { z } from "zod";

const botSchema = z
  .object({
    access_token: z.string(),
    workflow_id: z.string().nullable(),
  })
  .transform((bot) => ({
    accessToken: bot.access_token,
    existingWorkflowId: bot.workflow_id,
  }));

const responseSchema = z.object({
  ok: z.boolean(),
  description: z.string().optional(),
  result: z.boolean(),
});

export async function setWebhook({
  botId,
  workflowId,
  // webhookUrl = undefined,
  force = false,
}: {
  botId: string;
  workflowId: string | null;
  // webhookUrl?: string;
  force?: boolean;
}) {
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
  const { accessToken, existingWorkflowId } = botSchema.parse(bot);

  if (!bot) {
    throw new AideError({
      name: "EXECUTION_ERROR",
      message: "Bot not found",
    });
  }

  if (existingWorkflowId && !force) {
    return { hasExistingFlow: true, success: false };
  }

  // update by force or no existing workflow id
  // update bot's workflow_id
  await sql`
    UPDATE bots
    SET workflow_id = ${workflowId}
    WHERE id = ${botId} AND user_id = ${user.id}
  `;

  console.log(accessToken);

  const webhookUrl = "https://myurl.com/api/v1/somesomesome";
  // Send request to Telegram API
  const res = await fetch(
    `https://api.telegram.org/bot${accessToken}/setWebhook`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: webhookUrl,
      }),
    },
  );

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

  // revalidatePath("/app", "page");
  return { hasExistingFlow: !!existingWorkflowId, success: true };
}
