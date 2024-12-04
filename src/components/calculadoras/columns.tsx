"use client"

import { ColumnDef } from "@tanstack/react-table"

import { TypeCalculadoraSchema } from "@/validationSchemas/CalculadoraSchema"
import { TypeParametroSchema } from "@/validationSchemas/ParametroSchema"
import AccionesCalculadora from "./Acciones"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

// This type is used to define the shape of our data.
export type CalculadoraColumn = {
  id: number
  nombre: string
  categoria: string
  formula: string
  calculadora: TypeCalculadoraSchema
  parametros: TypeParametroSchema[]
}

export const calculadoraColumns: ColumnDef<CalculadoraColumn>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => {
      const calculadora = row.original.calculadora
      return (
        <div className="flex gap-2">
          <span>{calculadora.nombre}</span>
          {calculadora.enlace && (
            <Link href={`calculadoras/${calculadora.categoria}/${calculadora.enlace}`} target="_blank">
              <ExternalLink className="w-4 h-4" />
            </Link>
          )}
        </div>
      )
    }
  },
  {
    accessorKey: "categoria",
    header: "Categoria",
  },
  {
    accessorKey: "formula",
    header: "Formula",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const calculadora = row.original.calculadora
      const parametros = row.original.parametros

      return (
        <div className="flex gap-8">
          <AccionesCalculadora calculadora={calculadora} parametros={parametros} />
        </div>
      )
    },
  },
]
