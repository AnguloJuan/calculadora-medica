"use client"

import { eliminarParametroAction } from "@/utils/actions";
import { Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import DialogItem from "../DialogItem";
import { useToast } from "../Toast";
import { Button } from "../ui/button";
import { DialogClose, DialogDescription, DialogTitle } from "../ui/dialog";

const EliminarParametro = ({ id }: { id: number }) => {
  const router = useRouter();
  const { addToast } = useToast();

  const onClick = async () => {
    const formData = new FormData();
    formData.set('id', id.toString());
    try {
      const response = await eliminarParametroAction(formData);
      if (response.status !== 200) {
        addToast(
          response.error || 'Ha ocurrido un error al eliminar la parámetro.',
          'error',
        );
        return;
      }
      addToast(
        'La parámetro ha sido eliminada correctamente.',
        'success',
      );
      router.refresh();
    } catch (error) {
      addToast(
        'Ha ocurrido un error al eliminar la parámetro.',
        'error',
      );
    }

  }
  return (
    <DialogItem triggerChildren="Eliminar">
      <DialogTitle>Eliminar</DialogTitle>
      <DialogDescription>
        ¿Estás seguro que quieres eliminar esta parámetro?
        <br />
        <small>Asegurate primero de que el parámetro no esté en uso</small>
      </DialogDescription>
      <div className="flex flex-row justify-between gap-4">
        <DialogClose asChild>
          <Button variant="default" className="w-full"><X />Cancelar</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button variant="destructive" className="w-full" onClick={onClick}><Trash2 />Eliminar</Button>
        </DialogClose>
      </div>
    </DialogItem>
  )
}

export default EliminarParametro;