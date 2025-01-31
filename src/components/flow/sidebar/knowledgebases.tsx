import React, { type ReactNode } from "react";
import Link from "next/link";

import { SidebarMenuButton } from "@/components/ui/sidebar";
import { getAll } from "@/app/actions/db/knowledge/get";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import NewKnowledgebase from "./new-knowledgebase";
import ActivateKnowledge from "./activate-knowledge";

export function NavProjectsSkeleton() {
  return (
    <SidebarMenu>
      {Array.from({ length: 5 }).map((_, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuSkeleton showIcon />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

const KnowledgeBasesInternal = async () => {
  const knowledgebases = await getAll();

  return (
    <SidebarMenu>
      {knowledgebases.map((k) => (
        <SidebarMenuItem key={k.id}>
          <SidebarMenuButton asChild>
            <ActivateKnowledge knowledge={k} />
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

const KnowledgeBases = () => {
  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarGroupLabel>
            <span>Knowledge</span>
            <NewKnowledgebase />
          </SidebarGroupLabel>
          <React.Suspense fallback={<NavProjectsSkeleton />}>
            <KnowledgeBasesInternal />
          </React.Suspense>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
};

export default KnowledgeBases;
