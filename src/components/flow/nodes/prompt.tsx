"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Clipboard } from "lucide-react";
// import { marked } from "marked";
import DOMPurify from "dompurify";
import toast from "react-hot-toast";
import { useShallow } from "zustand/react/shallow";

import { useNodeStore } from "@/components/flow/store";
import { Spinner } from "@/components/ui/spinner";
import type { AideNode, PromptNode } from "./types";

function PromptNode({ id, isConnectable }: NodeProps<AideNode>) {
  const { node, setPrompt } = useNodeStore(
    useShallow((state) => ({
      node: state.nodes.find((n) => n.id === id),
      setPrompt: state.setPrompt,
    })),
  );
  if (!node) return null;
  if (node.type !== "prompt") return;

  const onChange = (e: { target: { value: string } }) => {
    setPrompt(id, e.target.value);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(node.data.response ?? "");
    toast.success("Response copied to clipboard");
  };

  return (
    <div className="relative w-80 rounded-xl border border-gray-200 bg-white p-3">
      <div className="">
        <div>
          <h1 className="block font-semibold tracking-tight">Prompt</h1>
          <label htmlFor="text" className="text-[10px] text-gray-500">
            Use this node for creating prompt in the flow.
          </label>
        </div>
        <textarea
          placeholder="Act as an expert in your summarization..."
          onChange={onChange}
          disabled={node.data.isLoading}
          className="w-full rounded-md border p-1.5 text-xs hover:cursor-text focus:border-0 focus:ring-0"
        />
        {node.data.isLoading && <Spinner />}
        {!node.data.isLoading && node.data.response && (
          <div className="mt-2">
            <div className="flex items-center justify-between">
              <h1 className="font-semibold tracking-tight">Response</h1>
              <button className="cursor-pointer p-1" onClick={copyToClipboard}>
                <Clipboard className="ml-2 h-3 w-3 cursor-pointer text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <p className="text-[10px] text-gray-500">
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(""),
                }}
              />
            </p>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default PromptNode;
