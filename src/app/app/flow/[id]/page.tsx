import Flow from "@/components/app/flow/flow";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return <Flow id={id} />;
}
