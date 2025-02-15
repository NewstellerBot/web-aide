"use server";

import mammoth from "mammoth";
// import PdfParse from "pdf-parse";
import pdf from "pdf-parse";
import { FileTypeError } from "@/lib/errors";

export async function fileToText(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  switch (file.type) {
    case "application/pdf":
      try {
        const pdfData = await pdf(buffer);
        // const pdfData = await PdfParse(buffer);
        return pdfData.text;
        return "mock pdf";
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
      try {
        return buffer.toString("utf-8");
      } catch (error) {
        throw new FileTypeError(
          `Failed to parse text file${error instanceof Error ? `: ${error.message}` : ""}`,
          error,
        );
      }

    default:
      throw new FileTypeError(
        `Unsupported file type: ${file.type}. Supported types are: PDF, DOCX, and plain text.`,
      );
  }
}
