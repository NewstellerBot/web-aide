"use client";

import { useClerk } from "@clerk/nextjs";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export default function Logout() {
  const { signOut } = useClerk();
  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem className="px-2">
          <SidebarMenuButton asChild>
            <Button
              variant={"outline"}
              onClick={() => signOut({ redirectUrl: "/" })}
            >
              Logout
            </Button>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
