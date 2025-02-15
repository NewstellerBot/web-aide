"use server";

import { currentUser } from "@clerk/nextjs/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 } from "uuid";
import { neon } from "@neondatabase/serverless";

import { env } from "@/env";
import { AideError } from "@/lib/errors";
import { fileToText } from "@/lib/adapters/file";
import { Embeddings } from "@/lib/llm";
import { revalidatePath } from "next/cache";

const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export const upload = async (f: File, knowledgeId: string) => {
  const user = await currentUser();
  if (!user)
    throw new AideError({ name: "BAD_REQUEST", message: "No user found" });
  if (!knowledgeId)
    throw new AideError({
      name: "BAD_REQUEST",
      message: "No knowledge id found",
    });

  if (!env.AWS_BUCKET_NAME)
    throw new AideError({
      name: "SERVER_ERROR",
      message: "S3 bucket name not configured",
    });

  try {
    const uuid = v4();
    const key = `aide/files/${user.id}/${uuid}-${f.name}`;
    const buffer = Buffer.from(await f.arrayBuffer());

    const command = new PutObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: f.type,
    });
    await s3Client.send(command);

    // Extract and log file contents
    const fileContent = await fileToText(f);
    const embeddings = new Embeddings();

    let totalTokens = 0;
    const chunks = await Promise.all(
      embeddings
        .chunkText(fileContent)
        .map(async ({ chunk, startIndex, endIndex }) => {
          const response = await embeddings.generate(chunk);
          totalTokens += response.tokens;
          return { chunk, startIndex, endIndex, ...response };
        }),
    );

    // insert the file and embeddings to postgres
    const sql = neon(env.POSTGRES_URL);

    // First, insert the main item
    const [item] = await sql`
      INSERT INTO items (name, s3_key, knowledge_id, processing, token_count)
      VALUES (${f.name}, ${key}, ${knowledgeId}, false, ${totalTokens})
      RETURNING id
    `;

    if (!item)
      throw new AideError({
        name: "SERVER_ERROR",
        message: "Failed to insert item",
      });

    // Then insert all embeddings for this item
    await Promise.all(
      chunks.map(async ({ embedding, startIndex, endIndex }) => {
        const vectorString = `[${embedding.join(",")}]`;
        await sql`
          INSERT INTO embeddings (item_id, embedding, start_index, end_index)
          VALUES (${item.id}, ${vectorString}::vector, ${startIndex}, ${endIndex})
        `;
      }),
    );

    // Invalidate the cache for the knowledge path
    revalidatePath(`/knowledge/${knowledgeId}`);

    return { key };
  } catch (error) {
    console.error("[Upload to s3]: ", error);
    throw new AideError({
      name: "SERVER_ERROR",
      message: "Failed to upload file to S3",
      cause: error,
    });
  }
};
