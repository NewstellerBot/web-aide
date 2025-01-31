"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { useShallow } from "zustand/react/shallow";

import { type Document } from "@/components/knowledge/store";
import { upload } from "@/app/actions/s3/upload";
import {
  useKnowledgeStore,
  type KnowledgeState,
} from "@/components/knowledge/store";

const selector = (state: KnowledgeState) => ({
  documents: state.documents,
  addDocument: state.addDocument,
});

export default function FilesDrop() {
  const { documents, addDocument } = useKnowledgeStore(useShallow(selector));
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      (async () => {
        try {
          const { url, key } = await upload(file);
          const newDoc: Document = {
            id: Math.random().toString(),
            name: file.name,
            uploadedAt: new Date(),
            tokenCount: file.length,
            s3Key: key,
            s3Url: url,
          };
          toast.success("File uploaded successfully");
          addDocument(newDoc);
        } catch (e) {
          toast.error("Error uploading file");
          console.error(e);
        }
      })().catch((e) => console.error(e));
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".txt"],
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
