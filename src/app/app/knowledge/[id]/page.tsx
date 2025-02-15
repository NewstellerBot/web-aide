import { Suspense } from "react";
import Knowledge from "@/components/knowledge/knowledge";
import { getWithItems } from "@/app/actions/db/knowledge/get";
import { Spinner } from "@/components/ui/spinner"; // Assuming you have a spinner component

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const knowledgeBase = await getWithItems(id);

  return (
    <>
      <div>Id: {id}</div>
      <Suspense fallback={<Spinner />}>
        <Knowledge id={id} knowledgeBase={knowledgeBase} />
      </Suspense>
    </>
  );
}
