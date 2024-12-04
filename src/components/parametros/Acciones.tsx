"use client"
import { TypeParametroSchema } from "@/validationSchemas/ParametroSchema";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import ActualizarParametroTabla from "./ActualizarParametroTabla";
import EliminarParametro from "./EliminarParametro";

export default function AccionesParametro({ parametro }: { parametro: TypeParametroSchema }) {
  const formData = new FormData();
  formData.set('id', parametro.id.toString());
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrur menú</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <ActualizarParametroTabla parametro={parametro} />
        <EliminarParametro id={parametro.id} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}