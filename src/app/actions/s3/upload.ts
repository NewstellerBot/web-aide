"use server";

import { currentUser } from "@clerk/nextjs/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 } from "uuid";

import { env } from "@/env";
import { AideError } from "@/lib/errors";

const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = async (f: File) => {
  const user = await currentUser();
  if (!user)
    throw new AideError({ name: "BAD_REQUEST", message: "No user found" });

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
    // Generate a signed URL for the uploaded file
    const getCommand = new PutObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key: key,
    });

    const url = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });
    return { url, key };
  } catch (error) {
    console.error("[S3 presigned url]: ", error);
    throw new AideError({
      name: "SERVER_ERROR",
      message: "Failed to upload file to S3",
      cause: error,
    });
  }
};

export { upload };
