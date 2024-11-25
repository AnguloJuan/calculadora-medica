import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Dashboard() {
  const DataCard = ({ titulo, descripcion, data }: {
    titulo: string,
    descripcion: string,
    data: string
  }) => {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>{titulo}</CardTitle>
          <CardDescription>{descripcion}</CardDescription>
        </CardHeader>
        <CardContent className="text-center content-center">
          <h1 className="text-2xl font-bold">{data}</h1>
        </CardContent>
      </Card>
    )
  }

  return (<>
    <header className="bg-backgroud shadow">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
    </header>
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="bg-backgroud shadow sm:rounded-lg">
        <div className="flex flex-row">
          <DataCard
            titulo="Calculadoras"
            descripcion="Cantidad de calculadoras en la pagina"
            data="10"
          />
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Parametros</h3>
          </div>
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Unidades</h3>
          </div>
        </div>
      </div>
    </main>
  </>)
}
