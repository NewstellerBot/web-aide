"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useShallow } from "zustand/react/shallow";
import Image from "next/image";
import { type Node } from "@xyflow/react";

import { cn } from "@/lib/utils";
import { useNodeStore } from "@/components/flow/store";
// import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { v4 } from "uuid";

export type Db = "chroma" | "postgres" | "mysql" | "pinecone";

export type DbNode = Node<
  {
    db: Db;
  },
  "db"
>;

export function defaultDbNode() {
  return {
    id: v4(),
    position: { x: 50, y: 50 },
    data: {
      db: "chroma",
    },
    type: "db",
  };
}

function DbNode({ isConnectable, selected }: NodeProps<DbNode>) {
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
                <div className="flex items-center gap-2">DB 2</div>
              </SelectItem>
              <SelectItem value="claude">
                <div className="flex items-center gap-2">DB 1</div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <label htmlFor="text" className="text-[10px] text-gray-500">
          Describe how the LLM should act.
        </label>
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

export default DbNode;