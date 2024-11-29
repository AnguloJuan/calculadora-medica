"use client"
import { Calculadora } from "@/utils/types";
import { MoreHorizontal } from "lucide-react";
import DialogItem from "../DialogItem";
import { Button } from "../ui/button";
import { DialogDescription, DialogTitle } from "../ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import EliminarCalculadora from "./EliminarCalculadora";

export default function AccionesCalculadora({ calculadora }: { calculadora: Calculadora }) {
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
        <DialogItem triggerChildren="Editar">
          <DialogTitle>Editar</DialogTitle>
          <DialogDescription>
            Editar calculadora.
          </DialogDescription>
          <p>…</p>
        </DialogItem>
        <EliminarCalculadora id={calculadora.id} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}