"use client";

import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";

import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { v4 } from "uuid";
import { useNodeStore } from "../store";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

export type DbNode = Node<{
  id: string;
  name: string;
}>;

export const defaultDbNode = () => ({
  id: v4(),
  position: { x: 50, y: 50 },
  data: {
    id: "",
    name: "",
  },
  type: "db",
});

function DbNodeClient({ isConnectable, selected, data }: NodeProps<DbNode>) {
  const knowledgeBases = useNodeStore((state) => state.knowledgeBases);
  return (
    <div
      className={cn(
        "relative w-80 rounded-xl border-2 border-gray-200 bg-white p-3",
        selected && "border-slate-400",
      )}
    >
      <div>
        <h1 className="block font-semibold tracking-tight">Knowledge Base</h1>
        <div className="flex items-center gap-1">
          <p className="text-[10px] text-gray-500">
            Search through selected knowledge base
          </p>
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className="h-3 w-3 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              The input on the left will be used as a query, and the results
              will be available on the right.
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="mb-2 mt-2">
          <Select
            defaultValue={data.id}
            onValueChange={(id) => console.log(id)}
          >
            <SelectTrigger className="w-full px-2 py-1 text-xs focus:border-slate-400 focus:ring-0">
              <SelectValue placeholder="Choose Knowledge Base..." />
            </SelectTrigger>
            <SelectContent className="text-xs">
              {knowledgeBases.map((kb) => (
                <SelectItem key={kb.id} value={kb.id}>
                  <div className="flex items-center gap-2">{kb.name}</div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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

export default DbNodeClient;
