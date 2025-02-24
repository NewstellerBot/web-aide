"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";

interface Bot {
  id: string;
  name: string;
  platform: "telegram";
}

const SAMPLE_BOTS: Bot[] = [
  {
    id: "8011966300:AAEXtz289cMCsuqVT_Zm5DVqRRix6VHCfOI",
    name: "Test Bot",
    platform: "telegram",
  },
  {
    id: "7654321:BBCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijk",
    name: "Support Bot",
    platform: "telegram",
  },
];

export default function ManageBots() {
  const router = useRouter();

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold">Manage Bots</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {SAMPLE_BOTS.map((bot) => (
          <Card
            key={bot.id}
            className="p-4 transition-transform hover:scale-105 cursor-pointer"
            onClick={() => router.push(`/app/bots/${bot.id}`)}
          >
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10">
                <Image
                  src="/telegram-logo.svg"
                  alt="Telegram Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className="font-semibold">{bot.name}</h3>
                <p className="truncate text-sm text-gray-500">{bot.id}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
