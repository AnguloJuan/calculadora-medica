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
import { actualizarParametroAction } from "@/utils/actions";
import { ParametroSchema, TypeParametroSchema } from "@/validationSchemas/ParametroSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Pencil, X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import FormularioParametro from "../formularios/FormularioParametro";
import { useToast } from "../Toast";

const ActualizarParametro = ({ parametro, setParametros }: { parametro: TypeParametroSchema, setParametros?: Dispatch<SetStateAction<TypeParametroSchema[]>> }) => {
  const { addToast } = useToast();
  const [open, setOpen] = useState(false);

  const methods = useFormContext();

  const initialValues: TypeParametroSchema = parametro.tipo_campo === 'numerico' ? {
    id: parametro.id,
    nombre: parametro.nombre,
    tipo_campo: parametro.tipo_campo,
    unidades: parametro.unidades,
    valorMinimo: parametro.valorMinimo as any,
    valorMaximo: parametro.valorMaximo as any,
  } : {
    id: parametro.id,
    nombre: parametro.nombre,
    tipo_campo: parametro.tipo_campo,
    opciones: parametro.opciones,
  }

  const form = useForm<TypeParametroSchema>({
    resolver: zodResolver(ParametroSchema),
    mode: 'onBlur',
    defaultValues: initialValues
  })

  const onSubmit = async () => {
    const output = await form.trigger();
    if (!output) return;

    const parametro = form.getValues();
    async function actualizarParametro() {
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

      const response = await actualizarParametroAction(formData);
      if (response.error) {
        addToast('Error al actualizar el parametro', 'error');
        return;
      }
      if (setParametros) {
        setParametros((prev) => prev.map((p) => p.id === parametro.id ? parametro : p));
      }
      methods && methods.setValue('parametros', methods.getValues('parametros').map((p: TypeParametroSchema) => p.id === parametro.id ? parametro : p));
      addToast('Parametro actualizado', 'success');
      setOpen(false);
    }
    actualizarParametro();
  }

  return (<>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant={'warning'} onClick={() => { }}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent className="sm:max-w-lg lg:max-w-lg">
          <DialogHeader>
            <DialogTitle>Actualizar parametro</DialogTitle>
            <DialogDescription>
              Los cambios afectaran a TODAS las calculadoras que usen este parametro.
            </DialogDescription>
          </DialogHeader>
          <section className="grid gap-4 py-4 max-w-full">
            <FormularioParametro form={form} />
          </section>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary" onClick={() => form.reset()}><X />Cancelar</Button>
            </DialogClose>
            <Button type="button" onClick={() => onSubmit()}><Edit />Actualizar</Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  </>)
}
export default ActualizarParametro;