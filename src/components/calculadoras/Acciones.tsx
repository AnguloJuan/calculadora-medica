"use client"
import { TypeCalculadoraSchema } from "@/validationSchemas/CalculadoraSchema";
import { TypeParametroSchema } from "@/validationSchemas/ParametroSchema";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import ActualizarCalculadora from "./ActualizarCalculadora";
import EliminarCalculadora from "./EliminarCalculadora";

export default function AccionesCalculadora({ calculadora, parametros }: { calculadora: TypeCalculadoraSchema, parametros: TypeParametroSchema[] }) {
  const formData = new FormData();
  formData.set('id', calculadora.id.toString());
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
        <ActualizarCalculadora calculadora={calculadora} parametros={parametros} />
        <EliminarCalculadora id={calculadora.id} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}