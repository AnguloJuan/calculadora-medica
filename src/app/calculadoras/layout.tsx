import Header from "@/components/Header"

export default function CalculadorasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="h-full">
      <Header />
      {children}
    </section>
  )
}