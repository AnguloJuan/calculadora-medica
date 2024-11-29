import { eliminarCalculadoraAction } from "@/utils/actions";
import DialogItem from "../DialogItem";
import { Button } from "../ui/button";
import { DialogClose, DialogDescription, DialogTitle } from "../ui/dialog";
import { useToast } from "../Toast";

const EliminarCalculadora = ({ id }: { id: number }) => {
  const formData = new FormData();
  formData.set('id', id.toString());
  const { addToast } = useToast();

  const onClick = () => {
    eliminarCalculadoraAction(formData);
    addToast(
      'La calculadora ha sido eliminada correctamente.',
      'success',
    );
  }
  return (
    <DialogItem triggerChildren="Eliminar">
      <DialogTitle>Eliminar</DialogTitle>
      <DialogDescription>
        ¿Estás seguro que quieres eliminar esta calculadora?
      </DialogDescription>
      <div className="flex flex-row justify-between gap-4">
        <DialogClose asChild>
          <Button variant="default" className="w-full">Cancelar</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button variant="destructive" className="w-full" onClick={onClick}>Eliminar</Button>
        </DialogClose>
      </div>
    </DialogItem>
  )
}

export default EliminarCalculadora;