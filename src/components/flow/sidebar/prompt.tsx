"use client";
import { type ReactNode } from "react";

import { useNodeStore } from "@/components/flow/store";
import { type NodeType } from "@/components/flow/types";

export default function Prompt({
  children,
  type,
}: {
  children?: ReactNode;
  type: NodeType;
}) {
  const setCurrentType = useNodeStore((s) => s.setCurrentType);

  return (
    <div
      draggable="true"
      className="rounded-lg px-3 py-2 text-sm hover:cursor-grab hover:bg-slate-50 active:cursor-grabbing"
      onDragStart={() => setCurrentType(type)}
    >
      {children}
    </div>
  );
}
