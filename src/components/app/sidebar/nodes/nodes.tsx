"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

import Node from "@/components/app/sidebar/nodes/node";
import type { NodeType } from "../types";

const nodes = [
  { type: "prompt", label: "💬 LLM model" },
  { type: "db", label: "💿 Knowledgebase" },
  { type: "APIInput", label: "🔌 API input" },
  { type: "APIOutput", label: "📬 API output" },
  { type: "botInput", label: "🤖 Bot Input" },
  { type: "botOutput", label: "🦾 Bot Output" },
];

const Nodes = () => {
  const pathname = usePathname();
  const isFlow = pathname.includes("/flow");
  return (
    <SidebarGroup className={cn(!isFlow && "hidden")}>
      <SidebarGroupLabel>
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" height={15} width={15} alt="logo" />
          <span className="font-bold text-black">aide</span>
        </div>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarGroupLabel>
          <span>Nodes</span>
        </SidebarGroupLabel>
        <SidebarMenu>
          {nodes.map((n) => (
            <SidebarMenuItem key={n.label}>
              <SidebarMenuButton asChild>
                <Node type={n.type as NodeType}>{n.label}</Node>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default Nodes;
