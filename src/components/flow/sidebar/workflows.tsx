import { getAll } from "@/app/actions/db/workflow/get";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenu,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";

export default async function Workflows() {
  const workflows = await getAll();

  return (
    <SidebarMenu>
      {workflows.map((workflow) => (
        <SidebarMenuItem key={workflow.name}>
          <SidebarMenuButton asChild>
            <span>{workflow.name}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

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
