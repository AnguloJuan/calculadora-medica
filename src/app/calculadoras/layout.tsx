import Header from "@/components/Header"
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
        <section className="h-full">
          <Header rol="admin" />
          {children}
        </section>
      </SidebarInset>
    </SidebarProvider>
  )
}