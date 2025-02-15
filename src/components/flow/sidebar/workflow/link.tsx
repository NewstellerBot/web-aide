"use client";

import { useNodeStore } from "@/components/flow/store";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";

export default function FlowLink() {
  const workflow = useNodeStore((state) => state.workflow);
  if (!workflow.id) return;

  const workflowUrl = `${window.location.origin}/api/execute/${workflow.id}`;
  return (
    <div className="flex items-center pr-2">
      <span className="text-xs">{workflowUrl}</span>
      <Button
        variant={"ghost"}
        size="icon"
        className="ml-2 h-6 w-6"
        onClick={() => {
          void navigator.clipboard.writeText(workflowUrl);
          toast.success("Copied to clipboard!");
        }}
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
}
