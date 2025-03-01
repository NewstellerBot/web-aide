"use client";

import { useState } from "react";
import DOMPurify from "isomorphic-dompurify";

import { cn } from "@/lib/utils";
import { SidebarMenuButton } from "@/components/ui/sidebar";

import Link from "next/link";
import { type Bot } from "@/app/actions/db/bot/schema";
import { usePathname } from "next/navigation";
import { upsert } from "@/app/actions/db/bot/upsert";

export default function ActivateBot({
  bot,
}: {
  bot: Omit<Bot, "access_token">;
}) {
  const [isContentEditable, setIsContentEditable] = useState(false);
  const [name, setName] = useState(bot.name);
  const pathname = usePathname();

  return (
    <>
      <Link href={`/app/bot/${bot.id}`}>
        <SidebarMenuButton
          className={cn(
            "hover:cursor-pointer",
            isContentEditable && "hover:cursor-text",
          )}
          variant={pathname.includes(bot.id) ? "outline" : "default"}
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
              await upsert({ ...bot, name: newName });
            }}
            dangerouslySetInnerHTML={{ __html: name }}
          />
        </SidebarMenuButton>
      </Link>
    </>
  );
}
