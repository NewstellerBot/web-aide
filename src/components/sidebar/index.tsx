import { Suspense } from "react";

import KnowledgeBases from "./knowledge/list";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

import Workflows, { NavProjectsSkeleton } from "./workflow/list";
import NewWorkflow from "./workflow/new";
import Nodes from "./nodes/nodes";
import Bots from "./bots/list";

const WorkflowsDirectory = () => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel asChild>
        <span>Workflows</span>
      </SidebarGroupLabel>
      <NewWorkflow />
      <SidebarGroupContent>
        <Suspense fallback={<NavProjectsSkeleton />}>
          <Workflows />
        </Suspense>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default async function AppSidebar() {
  return (
    <Sidebar variant="inset">
      <SidebarContent>
        <Nodes />
        <WorkflowsDirectory />
        <KnowledgeBases />
        <Bots />
      </SidebarContent>
    </Sidebar>
  );
}
