"use client"
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "@/lib/es-zod";
import { ParametroSchema } from "@/validationSchemas/ParametroSchema";
import { useToast } from "@/zustand/Toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";
import FormularioParametro from "./formularios/FormularioParametro";

const CrearParametro = () => {
  const { addToast } = useToast();

  const methods = useFormContext();
  const form = useForm<z.infer<typeof ParametroSchema>>({
    resolver: zodResolver(ParametroSchema),
    defaultValues: {
      id: 0,
      nombre: undefined,
      abreviatura: undefined,
      tipo_campo: undefined,
      valorMinimo: undefined,
      valorMaximo: undefined,
      unidades: [],
      opciones: undefined,
    },
  })
  if (methods) {
    console.log(methods);
  } else {
    console.log('no methods', form);
  }

  const onSubmit = (data: any) => {
    console.log(data);
    addToast('Parametro creado', 'success');
  }

  return (<>
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Crear parametro</Button>
      </DialogTrigger>
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
        <section className="grid gap-4 py-4">
          <FormularioParametro form={form} onSubmit={onSubmit} />
        </section>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>)
}
export default CrearParametro;