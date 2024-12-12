"use client";

import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { v4 } from "uuid";

import { cn } from "@/lib/utils";
import { useNodeStore } from "@/components/flow/store";
import { Input } from "@/components/ui/input";

export type OutputNode = Node<
  {
    id: string;
    name: string;
  },
  "APIOutput"
>;

export function defaultOutputNode() {
  return {
    id: v4(),
    position: { x: 50, y: 50 },
    data: {
      name: "",
      isLoading: false,
    },
    type: "APIOutput",
  };
}

function APIOutputNode({
  id,
  data,
  selected,
  isConnectable,
}: NodeProps<OutputNode>) {
  const setAPINodeName = useNodeStore((state) => state.setAPINodeName);

  return (
    <div
      className={cn(
        "relative w-80 rounded-xl border-2 border-gray-200 bg-white p-3",
        selected && "border-slate-400",
      )}
    >
      <div>
        <h1 className="block font-semibold tracking-tight">Output</h1>
        <label htmlFor="text" className="text-[10px] text-gray-500">
          Use this node to specify output variable from API.
        </label>

        <Input
          placeholder="some_variable..."
          onChange={(e) => setAPINodeName(id, e.target.value)}
          value={data.name}
        />
      </div>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default APIOutputNode;
