import Knowledge from "@/components/knowledge/knowledge";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return (
    <>
      <div>Id: {id}</div>
      <Knowledge />
    </>
  );
}
