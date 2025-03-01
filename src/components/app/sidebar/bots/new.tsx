"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { SidebarGroupAction } from "@/components/ui/sidebar";
import { create, upsert } from "@/app/actions/db/bot/upsert";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

export default function NewKnowledgebase() {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await toast.promise(create(name, accessToken), {
      loading: "Creating bot...",
      success: "Bot created successfully",
      error: "Error creating bot",
    });
    setIsLoading(false);
    setOpen(false);
    setName("");
    setAccessToken("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SidebarGroupAction
          className={cn("transition-transform", isLoading && "animation-spin")}
        >
          <Plus />
          <span className="sr-only">Add Bot</span>
        </SidebarGroupAction>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Bot</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter bot name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accessToken">Access Token</Label>
            <Input
              id="accessToken"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              type="password"
              placeholder="Enter access token"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            Create Bot
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
