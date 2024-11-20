"use client"
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "@/lib/es-zod";
import { ParametroSchema } from "@/validationSchemas/ParametroSchema";
import { useToast } from "@/zustand/Toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";
import FormularioParametro from "./formularios/FormularioParametro";
import { useState } from "react";

const CrearParametro = ({element}: {element?: Element | DocumentFragment}) => {
  const { addToast } = useToast();
  const [open, setOpen] = useState(false);

  const methods = useFormContext();
  const handleValidaton = () => {
    return zodResolver(ParametroSchema);
  };
  const formParametro = useForm<z.infer<typeof ParametroSchema>>({
    resolver: handleValidaton(),
    defaultValues: {
      id: 0,
    },
  })
  // if (methods) {
  //   console.log(methods);
  // } else {
  //   console.log('no methods', form);
  // }

  const submitParametro = (data: any) => {
    const output = formParametro.trigger()
console.log(output);

    if (!output) {
      return;
    }
    console.log(data);
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
              {/* {!methods ?
                "Al crear un parametro, este se agregará a la lista de parametros disponibles para las calculadoras."
                : "Este parametro se agregará a la lista de parametros de la calculadora."
              } */}
            </DialogDescription>
          </DialogHeader>
          <section className="grid gap-4 py-4 max-w-full">
            <FormularioParametro formParametro={formParametro} submitParametro={submitParametro} />
          </section>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  </>)
}
export default CrearParametro;