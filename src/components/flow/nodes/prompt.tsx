"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Clipboard } from "lucide-react";
// import { marked } from "marked";
import DOMPurify from "dompurify";
import toast from "react-hot-toast";
import { useShallow } from "zustand/react/shallow";
import Image from "next/image";
import { type Node } from "@xyflow/react";

import { cn } from "@/lib/utils";
import { useNodeStore } from "@/components/flow/store";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { v4 } from "uuid";

export type Model = "openai" | "claude";

export type PromptNode = Node<
  {
    prompt: string;
    model: Model;
    isLoading: boolean;
    response?: string;
  },
  "prompt"
>;

export function defaultPromptNode() {
  return {
    id: v4(),
    position: { x: 50, y: 50 },
    data: {
      prompt: "",
      model: "openai",
      isLoading: false,
    },
    type: "prompt",
  };
}

function PromptNode({
  id,
  data,
  selected,
  isConnectable,
}: NodeProps<PromptNode>) {
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
    await navigator.clipboard.writeText(data.response ?? "");
    toast.success("Response copied to clipboard");
  };
  return (
    <div
      className={cn(
        "relative w-80 rounded-xl border-2 border-gray-200 bg-white p-3",
        selected && "border-slate-400",
      )}
    >
      <div>
        <h1 className="block font-semibold tracking-tight">Prompt</h1>
        <label htmlFor="text" className="text-[10px] text-gray-500">
          Use this node for an LLM model.
        </label>
        <div className="mb-2">
          <Select defaultValue="openai">
            <SelectTrigger className="w-full px-2 py-1 text-xs focus:border-slate-400 focus:ring-0">
              <SelectValue placeholder="Choose LLM..." />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="openai">
                <div className="flex items-center gap-2">
                  <Image src="/openai.svg" alt="" width={15} height={15} />
                  OpenAI ChatGPT-4o-mini
                </div>
              </SelectItem>
              <SelectItem value="claude">
                <div className="flex items-center gap-2">
                  <Image src="/anthropic.png" alt="" width={15} height={15} />
                  Claude 3.5 Sonnet
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <label htmlFor="text" className="text-[10px] text-gray-500">
          Describe how the LLM should act.
        </label>
        <Textarea
          placeholder="Act as an expert in your summarization..."
          onChange={onChange}
          disabled={data.isLoading}
        />
        {data.isLoading && <Spinner />}
        {!data.isLoading && data.response && (
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
