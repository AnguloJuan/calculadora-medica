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
import { ParametroSchema, TypeParametroSchema } from "@/validationSchemas/ParametroSchema";
import { useToast } from "@/zustand/Toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import FormularioParametro from "../formularios/FormularioParametro";
import { actualizarParametroAction, crearParametroAction } from "@/utils/actions";

const CrearParametro = () => {
  const { addToast } = useToast();
  const [open, setOpen] = useState(false);

  const methods = useFormContext();

  const handleValidaton = () => {
    return zodResolver(ParametroSchema);
  };
  const form = useForm<TypeParametroSchema>({
    resolver: handleValidaton(),
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
        addToast('Error al crear el parametro', 'error');
        return;
      }
      addToast('Parametro creado', 'success');
      setOpen(false);
    }
    actualizarParametro();
  }

  return (<>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Actualizar parametro</Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent className="sm:max-w-lg lg:max-w-lg">
          <DialogHeader>
            <DialogTitle>Actualizar parametro</DialogTitle>
            <DialogDescription>
                Los cambios se guardaran en el parametro.
                Estos cambios afectaran a TODAS las calculadoras que tengan este parametro.
            </DialogDescription>
          </DialogHeader>
          <section className="grid gap-4 py-4 max-w-full">
            <FormularioParametro form={form} onSubmit={onSubmit} />
          </section>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary" onClick={() => form.reset()}>Cancelar</Button>
            </DialogClose>
            <Button type="button" onClick={() => onSubmit(form.getValues())}>Actualizar</Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  </>)
}
export default CrearParametro;