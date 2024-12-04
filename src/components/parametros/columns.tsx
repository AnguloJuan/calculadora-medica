"use client"

import { TypeParametroSchema } from "@/validationSchemas/ParametroSchema"
import { ColumnDef } from "@tanstack/react-table"
import AccionesParametro from "./Acciones"

export type ParametroColumn = {
  id: number;
  nombre: string;
  tipo_campo: "numerico" | "seleccion" | "radio";
  unidadesOpciones: string | any[];
  parametro: TypeParametroSchema
}

export const parametroColumns: ColumnDef<ParametroColumn>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "tipo_campo",
    header: "Tipo Campo",
  },
  {
    accessorKey: "unidadesOpciones",
    header: "Unidades o Opciones",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const parametro = row.original.parametro

      return (
        <div className="flex gap-8">
          <AccionesParametro parametro={parametro} />
        </div>
      )
    },
  },
]
