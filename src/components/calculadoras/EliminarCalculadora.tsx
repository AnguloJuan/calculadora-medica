"use client"
import { eliminarCalculadoraAction } from "@/utils/actions";
import { Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import DialogItem from "../DialogItem";
import { useToast } from "../Toast";
import { Button } from "../ui/button";
import { DialogClose, DialogDescription, DialogTitle } from "../ui/dialog";

const EliminarCalculadora = ({ id }: { id: number }) => {
  const router = useRouter();
  const formData = new FormData();
  formData.set('id', id.toString());
  const { addToast } = useToast();

  const onClick = () => {
    eliminarCalculadoraAction(formData);
    addToast(
      'La calculadora ha sido eliminada correctamente.',
      'success',
    );
    router.refresh();
  }
  return (
    <DialogItem triggerChildren="Eliminar">
      <DialogTitle>Eliminar</DialogTitle>
      <DialogDescription>
        ¿Estás seguro que quieres eliminar esta calculadora?
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

export default EliminarCalculadora;