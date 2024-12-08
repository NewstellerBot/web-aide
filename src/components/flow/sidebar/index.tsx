import React from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

import Node from "./node";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { type NodeType } from "../types";
import Workflows, { NavProjectsSkeleton } from "./workflows";

const nodes = [
  { type: "prompt", label: "💬 LLM model" },
  { type: "db", label: "💿 Knowledgebase" },
];

export default async function AppSidebar() {
  return (
    <Sidebar variant="inset">
      <SidebarContent>
        <SidebarGroup>
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

        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Workflows
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <React.Suspense fallback={<NavProjectsSkeleton />}>
                  <Workflows />
                </React.Suspense>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
    </Sidebar>
  );
}
