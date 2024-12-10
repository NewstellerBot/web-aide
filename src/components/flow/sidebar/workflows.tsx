import { getAll } from "@/app/actions/db/workflow/get";
import {
  SidebarMenuItem,
  SidebarMenu,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import ActivateWorkflow from "./activate-workflow";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
} from "@/components/ui/context-menu";
import ContextContent from "./context-content";

export default async function Workflows() {
  const workflows = await getAll();

  return (
    <SidebarMenu>
      {workflows.map((workflow) => (
        <SidebarMenuItem key={workflow.id}>
          <ContextMenu>
            <ContextMenuTrigger>
              <ActivateWorkflow workflow={workflow} />
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextContent workflow={workflow} />
            </ContextMenuContent>
          </ContextMenu>
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
