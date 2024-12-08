"use client";
import { type ReactNode } from "react";

import { useNodeStore } from "@/components/flow/store";
import { type NodeType } from "@/components/flow/types";
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
