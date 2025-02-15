import { Suspense } from "react";

import Wrapper from "@/components/flow/asyncWrapper";
import { Spinner } from "@/components/ui/spinner";

export default async function Flow({ id }: { id: string }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <Wrapper id={id} />;
    </Suspense>
  );
}
