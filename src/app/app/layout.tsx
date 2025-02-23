import { cookies } from "next/headers";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar/index";
import FlowLink from "@/components/sidebar/workflow/link";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <div className="flex items-center justify-between p-0.5">
          <SidebarTrigger />
          <FlowLink />
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
