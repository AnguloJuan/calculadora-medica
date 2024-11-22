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
import FormularioParametro from "./formularios/FormularioParametro";

type ParametroFields = TypeParametroSchema

const CrearParametro = ({ element }: { element?: Element | DocumentFragment }) => {
  const { addToast } = useToast();
  const [open, setOpen] = useState(false);

  const methods = useFormContext();

  const handleValidaton = () => {
    return zodResolver(ParametroSchema);
  };
  const form = useForm<ParametroFields>({
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

  const onSubmit = async (data: ParametroFields) => {
    const output = await form.trigger();
    if (!output) return;

    addToast('Parametro creado', 'success');
    setOpen(false);
  }

  return (<>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Crear parametro</Button>
      </DialogTrigger>
      <DialogPortal container={element}>
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
              <Button variant="secondary" onClick={() => form.reset()}>Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={() => onSubmit(form.getValues())}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  </>)
}
export default CrearParametro;