import React from "react";
import Image from "next/image";

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

import { type NodeType } from "../types";
import Workflows, { NavProjectsSkeleton } from "./workflows";
import NewWorkflow from "./new-worfklow";

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

        <SidebarGroup>
          <SidebarGroupLabel asChild>
            <span>Workflows</span>
          </SidebarGroupLabel>
          <NewWorkflow />
          <SidebarGroupContent>
            <React.Suspense fallback={<NavProjectsSkeleton />}>
              <Workflows />
            </React.Suspense>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
