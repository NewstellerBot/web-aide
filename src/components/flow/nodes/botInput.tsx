"use client";

import { Handle, Position, NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { v4 } from "uuid";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAideStore } from "@/lib/store";

export type BotInputNode = {
  id: string;
  data: {
    name: string;
    botId?: string;
    isLoading?: boolean;
  };
  type: "botInput";
};

export function defaultBotInputNode() {
  return {
    id: v4(),
    position: { x: 50, y: 50 },
    data: {
      name: "",
      isLoading: false,
    },
    type: "botInput",
  };
}

export default function BotInputNode({
  id,
  data,
  selected,
  isConnectable,
}: NodeProps<BotInputNode>) {
  const bots = useAideStore((state) => state.bots);
  const setAPINodeName = useAideStore((state) => state.setAPINodeName);

  return (
    <div
      className={cn(
        "relative w-80 rounded-xl border-2 border-gray-200 bg-white p-3",
        selected && "border-slate-400"
      )}
    >
      <div>
        <h1 className="block font-semibold tracking-tight">Bot Input</h1>
        <label htmlFor="text" className="text-[10px] text-gray-500">
          Select the bot to receive messages from
        </label>

        <Select
          value={data.botId}
          onValueChange={(value) => setAPINodeName(id, value)}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select a bot" />
          </SelectTrigger>
          <SelectContent>
            {bots.map((bot) => (
              <SelectItem key={bot.id} value={bot.id}>
                {bot.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </div>
  );
}
