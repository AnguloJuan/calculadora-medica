import Header from "@/components/Header/Header"
import { AppSidebar } from "@/components/side-bar/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { decrypt } from "@/utils/sessions"
import { cookies } from "next/headers"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookie = cookies().get('session')?.value;
  const session = await decrypt(cookie);
  return (
    <SidebarProvider>
      {session && <AppSidebar />}
      <SidebarInset>
        <div className="bg-background relative z-10 flex min-h-svh flex-col">
          <Header rol="admin" />
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}