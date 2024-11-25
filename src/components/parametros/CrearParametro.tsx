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
import { useToast } from "@/hooks/use-toast";
import { crearParametroAction } from "@/utils/actions";
import { ParametroSchema, TypeParametroSchema } from "@/validationSchemas/ParametroSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import FormularioParametro from "../formularios/FormularioParametro";

const CrearParametro = ({ setParametros }: { setParametros?: Dispatch<SetStateAction<TypeParametroSchema[]>> }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const methods = useFormContext();

  const form = useForm<TypeParametroSchema>({
    resolver: zodResolver(ParametroSchema),
    mode: 'onBlur',
    defaultValues: {
      id: 0,
      nombre: '',
      tipo_campo: '' as any,
      opciones: '',
      unidades: [],
      valorMinimo: '' as any,
      valorMaximo: '' as any,
    },
  })

  const onSubmit = async (data: TypeParametroSchema) => {
    const output = await form.trigger();
    if (!output) return;

    const parametro = form.getValues();
    async function crearParametro() {
      const formData = new FormData();
      formData.append('id', parametro.id.toString());
      formData.append('nombre', parametro.nombre);
      formData.append('tipo_campo', parametro.tipo_campo);
      formData.append('abreviatura', parametro.abreviatura || '');
      if (parametro.tipo_campo === 'numerico') {
        formData.append('valorMinimo', parametro.valorMinimo?.toString() || '');
        formData.append('valorMaximo', parametro.valorMaximo?.toString() || '');
        formData.append('unidades', JSON.stringify(parametro.unidades));
      }
      if (parametro.tipo_campo === 'seleccion' || parametro.tipo_campo === 'radio') formData.append('opciones', parametro.opciones || '');

      const response = await crearParametroAction(formData);
      if (response.error || !response.id) {
        toast({ title: 'Error al crear el parametro', variant: 'destructive' });
        return;
      }
      const nuevoParametro: TypeParametroSchema = { ...parametro, id: response.id };
      methods && methods.setValue('parametros', [...methods.getValues('parametros'), nuevoParametro]);
      setParametros && setParametros((parametros) => [...parametros, nuevoParametro]);
      toast({ title: 'Parametro creado' });
      setOpen(false);
    }
    crearParametro();
  }

  return (<>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus />
          Crear parametro
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent className="sm:max-w-lg lg:max-w-lg">
          <DialogHeader>
            <DialogTitle>Crear parametro</DialogTitle>
            <DialogDescription>
              {!methods ?
                "Al crear un parametro, este se agregará a la lista de parametros disponibles para las calculadoras."
                : "Este parametro se agregará a la lista de parametros de la calculadora."
              }
            </DialogDescription>
          </DialogHeader>
          <section className="grid gap-4 py-4 max-w-full">
            <FormularioParametro form={form} onSubmit={onSubmit} />
          </section>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary" onClick={() => form.reset()}>Cancelar</Button>
            </DialogClose>
            <Button type="button" onClick={() => onSubmit(form.getValues())}>Crear</Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  </>)
}
export default CrearParametro;