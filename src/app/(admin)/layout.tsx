import Header from "@/components/Header"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="h-full">
      <Header rol="admin" />
      {children}
    </section>
  )
}