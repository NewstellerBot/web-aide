import React from "react";

import { SidebarMenuButton } from "@/components/ui/sidebar";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import ActivateKnowledge from "@/components/flow/sidebar/knowledge/activate";
import NewKnowledgebase from "@/components/flow/sidebar/knowledge/new";

import { getAll } from "@/app/actions/db/knowledge/get";

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
  const knowledgeBases = await getAll();
  return (
    <SidebarMenu>
      {knowledgeBases.map((k) => (
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
