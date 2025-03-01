"use client";

import { useState } from "react";
import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import type { Workflow } from "@/app/actions/db/workflow/get";
import { upsert } from "@/app/actions/db/workflow/upsert";

export default function ActivateWorkflow({ workflow }: { workflow: Workflow }) {
  const [isContentEditable, setIsContentEditable] = useState(false);
  const [name, setName] = useState(workflow.name);
  const pathname = usePathname();

  return (
    <>
      <Link href={`/app/flow/${workflow.id}`}>
        <SidebarMenuButton
          className={cn(
            "hover:cursor-pointer",
            isContentEditable && "hover:cursor-text",
          )}
          variant={pathname.includes(workflow.id) ? "outline" : "default"}
          asChild
        >
          <span
            contentEditable={isContentEditable}
            onKeyDown={async (e) => {
              if (e.key !== "Enter") return;
              e.preventDefault();
              e.currentTarget.blur();
            }}
            onDoubleClick={(e) => {
              setIsContentEditable(true);
              e.currentTarget.focus();
            }}
            onBlur={async (e) => {
              setIsContentEditable(false);
              const newName = DOMPurify.sanitize(e.currentTarget.innerText);
              setName(newName);
              await upsert({ ...workflow, name: newName });
            }}
            dangerouslySetInnerHTML={{ __html: name }}
          />
        </SidebarMenuButton>
      </Link>
    </>
  );
}
