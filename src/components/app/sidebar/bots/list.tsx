import React from "react";

import { getAll } from "@/app/actions/db/bot/get";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import NewBot from "@/components/app/sidebar/bots/new";
import ActivateBot from "@/components/app/sidebar/bots/activate";

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
