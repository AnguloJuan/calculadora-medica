import { Boton } from "@/components/Botones";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";

export default function CalculadorasPage() {
  return (<>
    <header className="bg-background dark:bg-container shadow">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight">Calculadoras</h1>
      </div>
    </header>
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="bg-background dark:bg-container shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6">Calculadoras</h3>
          <Link href="/nueva-calculadora">
            <Button variant="default">
              <IconPlus className="w-5 h-5" />
              <span className="block text-sm">Nueva calculadora</span>
            </Button>
          </Link>
        </div>
      </div>
    </main>
  </>)
}
