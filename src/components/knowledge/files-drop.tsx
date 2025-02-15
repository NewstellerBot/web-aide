"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

import { upload } from "@/app/actions/s3/upload";

export default function FilesDrop({ knowledgeId }: { knowledgeId: string }) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    (async () => {
      const uploadedFiles = Promise.all(
        acceptedFiles.map((file) => upload(file, knowledgeId)),
      );
      await toast.promise(uploadedFiles, {
        loading: "Uploading files...",
        success: "Uploaded files!",
        error: "Error while uploading files",
      });
    })().catch((e) => console.error(e));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".txt", ".md"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`mb-8 cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/50"}`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-lg">Drop the files here ...</p>
      ) : (
        <div>
          <p className="mb-2 text-lg">
            Drag &apos;n&apos; drop some files here, or click to select files
          </p>
          <p className="text-sm text-gray-500">
            Supports .txt, .pdf, .doc, .docx files
          </p>
        </div>
      )}
    </div>
  );
}
