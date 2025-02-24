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
import ActivateKnowledge from "@/components/sidebar/knowledge/activate";
import NewBot from "@/components/sidebar/bots/new";

import { getAll } from "@/app/actions/db/bot/get";
import ActivateBot from "./activate";

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

const BotsInternal = async () => {
  const bots = await getAll();
  return (
    <SidebarMenu>
      {bots.map((b) => (
        <SidebarMenuItem key={b.id}>
          <SidebarMenuButton asChild>
            <ActivateBot bot={b} />
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

const Bots = () => {
  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarGroupLabel>
            <span>Bots</span>
            <NewBot />
          </SidebarGroupLabel>
          <React.Suspense fallback={<NavProjectsSkeleton />}>
            <BotsInternal />
          </React.Suspense>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
};

export default Bots;
