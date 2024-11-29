"use client"

import { ColumnDef } from "@tanstack/react-table"

import { TypeCalculadoraSchema } from "@/validationSchemas/CalculadoraSchema"
import { TypeParametroSchema } from "@/validationSchemas/ParametroSchema"
import AccionesCalculadora from "./Acciones"

// This type is used to define the shape of our data.
export type CalculadoraTable = {
  id: number
  nombre: string
  categoria: string
  formula: string
  calculadora: TypeCalculadoraSchema
  parametros: TypeParametroSchema[]
}

export const columns: ColumnDef<CalculadoraTable>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
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
