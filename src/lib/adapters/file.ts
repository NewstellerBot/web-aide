"use server";

import mammoth from "mammoth";
import pdf from "pdf-parse";
import { FileTypeError } from "@/lib/errors";

type FileInput = Buffer | { arrayBuffer(): Promise<ArrayBuffer>; type: string };

export async function fileToText(input: FileInput, contentType?: string): Promise<string> {
  const buffer = 'arrayBuffer' in input 
    ? Buffer.from(await input.arrayBuffer())
    : input;

  const type = 'type' in input ? input.type : contentType;

  switch (type) {
    case "application/pdf":
      try {
        const pdfData = await pdf(buffer);
        return pdfData.text;
      } catch (error) {
        throw new FileTypeError(
          `Failed to parse PDF file${error instanceof Error ? `: ${error.message}` : ""}`,
          error,
        );
      }

    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      try {
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
      } catch (error) {
        throw new FileTypeError(
          `Failed to parse DOCX file${error instanceof Error ? `: ${error.message}` : ""}`,
          error,
        );
      }

    case "text/plain":
    case "application/octet-stream":
    default:
      try {
        return buffer.toString("utf-8");
      } catch (error) {
        throw new FileTypeError(
          `Failed to parse text file${error instanceof Error ? `: ${error.message}` : ""}`,
          error,
        );
      }
  }
}
