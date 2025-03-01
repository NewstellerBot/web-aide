"use client";

import { useState } from "react";
import DOMPurify from "isomorphic-dompurify";

import { cn } from "@/lib/utils";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { upsert } from "@/app/actions/db/knowledge/upsert";

import Link from "next/link";
import { type Knowledge } from "@/app/actions/db/knowledge/get";
import { usePathname } from "next/navigation";

export default function ActivateWorkflow({
  knowledge,
}: {
  knowledge: Knowledge;
}) {
  const [isContentEditable, setIsContentEditable] = useState(false);
  const [name, setName] = useState(knowledge.name);
  const pathname = usePathname();

  return (
    <>
      <Link href={`/app/knowledge/${knowledge.id}`}>
        <SidebarMenuButton
          className={cn(
            "hover:cursor-pointer",
            isContentEditable && "hover:cursor-text",
          )}
          variant={pathname.includes(knowledge.id) ? "outline" : "default"}
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
              await upsert({ ...knowledge, name: newName });
            }}
            dangerouslySetInnerHTML={{ __html: name }}
          />
        </SidebarMenuButton>
      </Link>
    </>
  );
}
