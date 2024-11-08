import { Boton } from "@/components/Botones";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";

export default function CalculadorasPage() {
  return (<>
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight">Calculadoras</h1>
      </div>
    </header>
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Calculadoras</h3>
          <Link href="/nueva-calculadora">
            <Boton variante="success">
              <IconPlus className="w-5 h-5" />
              <span className="block text-sm">Nueva calculadora</span>
            </Boton>
          </Link>
        </div>
      </div>
    </main>
  </>)
}
