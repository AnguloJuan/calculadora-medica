"use client"
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { crearParametroAction, crearUnidadAction } from "@/utils/actions";
import { ParametroSchema, TypeParametroSchema } from "@/validationSchemas/ParametroSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import FormularioParametro from "../formularios/FormularioParametro";
import { useToast } from "../Toast";
import UnidadSchema from "@/validationSchemas/UnidadSchema";
import { z } from "@/lib/es-zod";
import FormularioUnidad from "../FormularioUnidad";

type TypeUnidadSchema = z.infer<typeof UnidadSchema>;

const CrearUnidad = ({ setParametros }: { setParametros?: Dispatch<SetStateAction<TypeParametroSchema[]>> }) => {
  const { addToast } = useToast();
  const [open, setOpen] = useState(false);

  const methods = useFormContext();

  const form = useForm<TypeUnidadSchema>({
    resolver: zodResolver(UnidadSchema),
    mode: 'onBlur',
    defaultValues: {
      id: 0,
      unidad: '',
      conversion: '' as any,
      id_unidad_conversion: '' as any,
    },
  })

  const onSubmit = async (data: TypeParametroSchema) => {
    const output = await form.trigger();
    if (!output) return;

    const parametro = form.getValues();
    async function crearUnidad() {
      const formData = new FormData();
      formData.append('id', parametro.id.toString());
      formData.append('unidad', parametro.unidad);
      formData.append('conversion', parametro.conversion?.toString() || '');
      formData.append('id_unidad_conversion', parametro.id_unidad_conversion?.toString() || '');

      const response = await crearUnidadAction(formData);
      if (response.error || !response.id) {
        addToast(response.error!, 'error');
        return;
      }
      const nuevaUnidad: TypeUnidadSchema = { ...parametro, id: response.id };
      methods && methods.setValue('parametros', [...methods.getValues('parametros'), nuevaUnidad]);
      // setParametros && setParametros((parametros) => [...parametros, nuevaUnidad]);
      // addToast('Unidad creada', 'success');
      setOpen(false);
    }
    crearUnidad();
  }

  return (<>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="success" type="button">
          <Plus />
          Crear unidad
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent className="sm:max-w-lg lg:max-w-lg">
          <DialogHeader>
            <DialogTitle>Crear Unidad</DialogTitle>
            <DialogDescription>
              {!methods ?
                "Al crear una unidad, este se agregará a la lista de unidades disponibles para los parámetros."
                : "Esta unidad se agregará al lista de unidades del parametro."
              }
            </DialogDescription>
          </DialogHeader>
          <section className="grid gap-4 py-4 max-w-full">
            <FormularioUnidad form={form} onSubmit={onSubmit} />
          </section>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary" onClick={() => form.reset()}>Cancelar</Button>
            </DialogClose>
            <Button type="button" variant={'success'} onClick={() => onSubmit(form.getValues())}>Crear</Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  </>)
}
export default CrearUnidad;