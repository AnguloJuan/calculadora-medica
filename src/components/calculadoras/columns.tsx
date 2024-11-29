"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Calculadora } from "@/utils/types"
import AccionesCalculadora from "./Acciones"

// This type is used to define the shape of our data.
export type CalculadoraTable = {
  id: number
  nombre: string
  categoria: string
  formula: string
  calculadora: Calculadora
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

      return (
        <div className="flex gap-8">
          <AccionesCalculadora calculadora={calculadora} />
        </div>
      )
    },
  },
]
