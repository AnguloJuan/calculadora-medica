import CrearUnidad from "@/components/unidades/CrearUnidad";

export default function UnidadesPage() {
  return (<>
    <header className="bg-background dark:bg-container shadow">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight">Unidades</h1>
      </div>
    </header>
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="bg-background dark:bg-container shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6">Unidades</h3>
          <CrearUnidad />
        </div>
      </div>
    </main>
  </>)
}
