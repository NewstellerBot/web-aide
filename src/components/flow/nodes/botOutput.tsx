"use client";

import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { v4 } from "uuid";
import { InfoIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type OutputNode = Node<{ foo: "bar" }, "botOutput">;

export function defaultBotOutputNode() {
  return {
    id: v4(),
    // Node type requires data
    data: { foo: "bar" },
    position: { x: 50, y: 50 },
    type: "botOutput",
  };
}

function BotOutput({ selected, isConnectable }: NodeProps<OutputNode>) {
  return (
    <div
      className={cn(
        "relative w-80 rounded-xl border-2 border-gray-200 bg-white p-3",
        selected && "border-slate-400",
      )}
    >
      <div>
        <h1 className="block font-semibold tracking-tight">Bot Output</h1>
        <div className="flex items-center gap-1">
          <label htmlFor="text" className="text-[10px] text-gray-500">
            Use this node to specify output for the bot.
          </label>
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className="h-3 w-3 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              You can add multiple output nodes to handle different message
              responses from your bot.
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default BotOutput;
