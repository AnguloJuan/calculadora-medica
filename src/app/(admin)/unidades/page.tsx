import BotonCrearUnidad from "@/components/BotonCrearUnidad";

export default function UnidadesPage() {
  return (<>
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight">Unidades</h1>
      </div>
    </header>
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Unidades</h3>
          <BotonCrearUnidad shouldClose={true} />
        </div>
      </div>
    </main>
  </>)
}
