import { Suspense } from "react";
import Knowledge from "@/components/knowledge/knowledge";
import { Spinner } from "@/components/ui/spinner"; // Assuming you have a spinner component

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return (
    <>
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Spinner />
          </div>
        }
      >
        <Knowledge id={id} />
      </Suspense>
    </>
  );
}
