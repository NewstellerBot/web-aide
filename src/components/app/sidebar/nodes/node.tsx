"use client";
import { type ReactNode } from "react";

import { useNodeStore } from "@/components/app/sidebar/store";
import { type NodeType } from "@/components/app/sidebar/types";
import { SidebarMenuButton } from "@/components/ui/sidebar";

export default function Node({
  children,
  type,
}: {
  children?: ReactNode;
  type: NodeType;
}) {
  const setCurrentType = useNodeStore((s) => s.setCurrentType);

  return (
    <SidebarMenuButton
      draggable="true"
      onDragStart={() => setCurrentType(type)}
    >
      {children}
    </SidebarMenuButton>
  );
}
