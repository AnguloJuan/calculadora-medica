import TarjetaCalculadora from "@/components/calculadoras/tarjetaCalculadora"
import { Each } from "@/components/EachOf"
import Header from "@/components/Header/Header"
import { conectarBd } from "@/db/conectarDb"
import { Calculadora } from "@/utils/types"
import { RowDataPacket } from "mysql2"
import { redirect } from "next/navigation"

export default async function Home() {
  const conexion = await conectarBd()
  async function obtenerCalculadoras() {
    interface RowsCalculadora extends RowDataPacket, Calculadora {}
    try {
      const [rows] = await conexion.query<RowsCalculadora[]>(
        "SELECT * FROM calculadora"
      )

      return rows
    } catch (error) {
      console.error(error)
      redirect("/404")
    }
  }

  const calculadoras: Calculadora[] = await obtenerCalculadoras()
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-between p-24 pt-16 gap-3">
        <h1 className="text-3xl font-bold">Calculadoras</h1>
        <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]"></div>
        {/* Search input */}
        <div className="w-full px-8 md:px-12 lg:px-20 flex justify-center">
          <input
            type="search"
            placeholder="Buscar calculadora..."
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="w-full flex flex-col items-center gap-4 px-8 md:px-12 lg:px-20 mt-8">
          <Each
            of={calculadoras}
            render={(calculadora) => {
              return <TarjetaCalculadora {...calculadora} />
            }}
          />
        </div>
      </main>
    </>
  )
}
