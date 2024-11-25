import { Calculadora } from "@/utils/types"
import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card"

export default function TarjetaCalculadora(
  calculadora: Calculadora
) {
  return (

    <Link href={`${calculadora.categoria}/${calculadora.enlace}`} className="w-full">
      <Card className="w-full bg-container">
        <CardHeader>
          <CardTitle>{calculadora.nombre}</CardTitle>
          <CardDescription>{calculadora.descripcion_corta}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}