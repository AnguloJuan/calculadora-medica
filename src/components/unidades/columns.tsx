"use client"

import { ColumnDef } from "@tanstack/react-table"

// import AccionesUnidad from "./Acciones"
import { Unidad } from "@/utils/types"

export type UnidadColumn = {
  id: number
  nombre: string
  id_unidad_conversion?: number | null
  conversion?: string | null
  unidad: Unidad
  unidades: Unidad[]
}

export const unidadColumns: ColumnDef<UnidadColumn>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "nombre",
    header: "Unidad",
  },
  {
    accessorKey: "id_unidad_conversion",
    header: "ID Unidad Conversion",
  },
  {
    accessorKey: "conversion",
    header: "Conversion",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const unidad = row.original.unidad
      const unidades = row.original.unidades

      return (
        <div className="flex gap-8">
          {/* <AccionesUnidad unidad={unidad} unidades={unidades} /> */}
        </div>
      )
    },
  },
]
