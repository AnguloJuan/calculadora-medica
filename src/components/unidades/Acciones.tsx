"use client"
import { Unidad } from "@/utils/types";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import ActualizarUnidad from "./ActualizarUnidad";
import EliminarUnidad from "./EliminarUnidad";

export default function AccionesUnidad({ unidad }: { unidad: Unidad }) {
  const formData = new FormData();
  formData.set('id', unidad.id.toString());
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
        <ActualizarUnidad unidad={unidad} />
        <EliminarUnidad id={unidad.id} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}