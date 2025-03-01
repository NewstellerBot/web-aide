"use client";

import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { useShallow } from "zustand/react/shallow";
import { toast } from "react-hot-toast";
import { useState } from "react";

import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { v4 } from "uuid";
import { set, z } from "zod";
import { useNodeStore } from "../../sidebar/store";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import Image from "next/image";
import { type AideState } from "../../sidebar/types";
import { setWebhook } from "@/app/actions/db/bot/webhook";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type GetAllResponse as Bot } from "@/app/actions/db/bot/get";

export const DataSchema = z.object({
  id: z.string(),
  name: z.string(),
});

type Data = z.infer<typeof DataSchema>;
export type BotNode = Node<Data>;

export const defaultBotInputNode = () => ({
  id: v4(),
  position: { x: 50, y: 50 },
  data: {
    id: "",
    name: "",
  },
  type: "botInput",
});

const selector = (state: AideState) => ({
  bots: state.bots,
  workflow: state.workflow,
  setBot: state.setBot,
});

function BotInput({ isConnectable, selected, data, id }: NodeProps<BotNode>) {
  // Local state
  const { bots, setBot, workflow } = useNodeStore(useShallow(selector));
  const bot = bots.find((b) => b.id === data.id);
  const [selectedBot, setSelectedBot] = useState<Bot | null | undefined>(bot);
  // Workflow id in db is not not the same as the one in the store
  // meaning that the user has changed the bot to handle other workflow
  const isWrongWorkflow = !!selectedBot
    ? selectedBot.workflowId !== workflow.id
    : false;

  // Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSelect = async (newBotId: string) => {
    const newBot = bots.find((b) => b.id === newBotId)!;
    setSelectedBot({ ...newBot, workflowId: workflow.id });
    // setBot(id, newBot);
    const { hasExistingFlow, success } = await setWebhook({
      botId: newBotId,
      workflowId: workflow.id,
    });
    if (!success && hasExistingFlow) setIsDialogOpen(true);
    if (success) setBot(id, newBot);
  };

  const handleConfirm = async () => {
    if (!selectedBot) return;

    await toast.promise(
      setWebhook({
        botId: selectedBot.id,
        workflowId: workflow.id,
        force: true,
      }),
      {
        success: "Bot workflow changed",
        error: "Failed to change bot workflow",
        loading: "Changing bot workflow...",
      },
    );
    setBot(id, { ...selectedBot, workflowId: workflow.id });
    setIsDialogOpen(false);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setSelectedBot(bot);
  };

  return (
    <>
      <div
        className={cn(
          "relative w-80 rounded-xl border-2 border-gray-200 bg-white p-3",
          selected && "border-slate-400",
          isWrongWorkflow && "border-red-500",
        )}
      >
        <div>
          <h1 className="block font-semibold tracking-tight">Bot Input</h1>
          <div className="flex flex-col justify-center gap-1">
            <div className="flex items-center gap-1">
              <p className="text-[10px] text-gray-500">
                Select a bot to process your input
              </p>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  The selected bot will process the input and generate a
                  response
                </TooltipContent>
              </Tooltip>
            </div>
            {isWrongWorkflow && (
              <p className="text-[10px] font-semibold text-red-800">
                This bot is used in another workflow. It will not be active
                here.
              </p>
            )}
          </div>
          <div className="mb-2 mt-2">
            <Select value={selectedBot?.id} onValueChange={handleSelect}>
              <SelectTrigger className="w-full px-2 py-1 text-xs focus:border-slate-400 focus:ring-0">
                <SelectValue placeholder="Choose Bot..." />
              </SelectTrigger>
              <SelectContent className="text-xs">
                {bots.map((bot) => (
                  <SelectItem key={bot.id} value={bot.id}>
                    <div className="flex items-center gap-2">
                      <Image
                        src="/telegram-logo.svg"
                        alt=""
                        width={15}
                        height={15}
                      />
                      {bot.name}
                    </div>
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
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Bot Workflow</DialogTitle>
            <DialogDescription>
              This bot is already connected to another workflow. Are you sure
              you want to change it?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-3">
            <DialogClose asChild>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default BotInput;
