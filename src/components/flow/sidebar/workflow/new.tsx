"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { SidebarGroupAction } from "@/components/ui/sidebar";
import { upsert } from "@/app/actions/db/workflow/upsert";
import { cn } from "@/lib/utils";

export default function NewWorkflow() {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <SidebarGroupAction
      onClick={async () => {
        setIsLoading(true);
        await upsert({ name: "Untitled", id: undefined });
        setTimeout(() => setIsLoading(false), 1000);
      }}
      className={cn("transition-transform", isLoading && "animation-spin")}
    >
      <Plus />
      <span className="sr-only">Add Project</span>
    </SidebarGroupAction>
  );
}
