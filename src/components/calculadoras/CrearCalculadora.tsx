"use client"
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { z } from "@/lib/es-zod";
import { crearCalculadoraAction } from "@/utils/actions";
import CalculadoraSchema from "@/validationSchemas/CalculadoraSchema";
import { TypeParametroSchema } from "@/validationSchemas/ParametroSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "../Toast";
import FormularioCalculadora from "../formularios/FormularioCalculadora";

type TypeCalculadoraSchema = z.infer<typeof CalculadoraSchema>;

const CrearCalculadora = ({ parametros }: { parametros: TypeParametroSchema[] }) => {
  const { addToast } = useToast();
  const [open, setOpen] = useState(false);
  const form = useForm<TypeCalculadoraSchema>({
    resolver: zodResolver(CalculadoraSchema),
    defaultValues: {
      id: 0,
      nombre: "",
      descripcion: "",
      descripcion_corta: "",
      resultados_recomendaciones: "",
      categoria: "",
      enlace: "",
      formula: "",
      evidencias: [],
      parametros: [],
    },
  })

  function onSubmit(values: TypeCalculadoraSchema) {
    const formulario = new FormData(document.getElementById("form_calculadora") as HTMLFormElement);
    formulario.set('id', '0');
    formulario.set('enlace', '');
    const datosFormulario = Object.fromEntries(formulario.entries());

    async function guardarCalculadora() {
      const respuesta = await crearCalculadoraAction(formulario)
      if (respuesta.error) {
        addToast(
          respuesta.error,
          'error'
        );
        return;
      }
      var kebabCase = require('lodash/kebabCase');
      const { categoria } = datosFormulario;
      const enlace = `${kebabCase(categoria)}/${respuesta.enlace}`;
      addToast(
        <>
          Calculadora guardada exitosamente <br />
          haz click para verla: {' '}
          <Link
            href={`/calculadoras/${enlace}`}
            className="underline text-blue-500 cursor-pointer hover:text-blue-700 transition-colors"
          >
            ver calculadora
          </Link>
        </>,
        'success'
      );
    }

    guardarCalculadora();
  }

  return (<>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="success" type="button">
          <Plus />
          Crear nueva calculadora
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent className="top-[50%] -bottom-[40%] overflow-y-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl px-20 py-12">
          <DialogHeader>
            <DialogTitle className="text-3xl font-semibold tracking-tight first:mt-0">Crear nueva calculadora</DialogTitle>
            <DialogDescription>
              Llena los campos para crear una nueva calculadora
            </DialogDescription>
          </DialogHeader>
          <section className="grid gap-4 py-4 w-full">
            <FormularioCalculadora form={form} onSubmit={onSubmit} parametros={parametros} />
          </section>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  </>)
}
export default CrearCalculadora;