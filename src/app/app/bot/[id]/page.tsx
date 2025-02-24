import { Suspense } from "react";

import { get } from "@/app/actions/db/bot/get";
import BotDetails from "@/components/bots/bot-details";
import { Spinner } from "@/components/ui/spinner";

const Bot = async ({ id }: { id: string }) => {
  const bot = await get(id);
  return <BotDetails bot={bot} />;
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return (
    <>
      <Suspense fallback={<Spinner />}>
        <Bot id={id} />
      </Suspense>
    </>
  );
}
