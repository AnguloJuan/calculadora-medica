import { actualizarUnidadAction } from "@/utils/actions";
import { Unidad } from "@/utils/types";
import UnidadSchema from "@/validationSchemas/UnidadSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import DialogItem from "../DialogItem";
import FormularioUnidad from "../formularios/FormularioUnidad";
import { useToast } from "../Toast";
import { Button } from "../ui/button";
import { DialogClose, DialogDescription, DialogTitle } from "../ui/dialog";


const ActualizarUnidad = ({ unidad }: { unidad: Unidad }) => {
  const { addToast } = useToast();
  const router = useRouter();

  const initialValues: Unidad = {
    id: unidad.id,
    unidad: unidad.unidad,
    id_unidad_conversion: unidad.id_unidad_conversion,
    conversion: unidad.conversion,
  }

  const form = useForm<Unidad>({
    resolver: zodResolver(UnidadSchema),
    mode: 'onBlur',
    defaultValues: initialValues
  })

  const onSubmit = async () => {
    const output = await form.trigger();
    if (!output) return;

    const unidad = form.getValues();
    const formData = new FormData();
    formData.append('id', unidad.id.toString());
    formData.append('unidad', unidad.unidad);
    formData.append('id_unidad_conversion', unidad.id_unidad_conversion?.toString() ?? '');
    formData.append('conversion', unidad.conversion || '');
    try {
      const response = await actualizarUnidadAction(formData);
      if (response.error) {
        addToast(response.error, 'error');
        return;
      }
      addToast('Unidad actualizada', 'success');
      router.refresh();
    } catch (error) {
      addToast('Error al actualizar la unidad', 'error');
    }
  }


  return (
    <DialogItem triggerChildren="Editar" className={'sm:max-w-lg lg:max-w-lg'}>
      <DialogTitle className="text-3xl font-semibold tracking-tight first:mt-0">Actualizar unidad</DialogTitle>
      <DialogDescription></DialogDescription>
      <FormularioUnidad form={form} />
      <div className="flex flex-row justify-between gap-4">
        <DialogClose asChild>
          <Button variant="default" className="w-full" onClick={() => form.reset()}><X />Cancelar</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button type="button" variant="warning" className="w-full" onClick={() => onSubmit()}><Edit />Actualizar</Button>
        </DialogClose>
      </div>
    </DialogItem>
  )
}

export default ActualizarUnidad;