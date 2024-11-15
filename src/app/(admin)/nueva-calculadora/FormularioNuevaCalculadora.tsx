"use client"

import { Each } from "@/components/EachOf";
import AgregarEvidencias from "@/components/nueva-calculadora/AgregarEvidencias";
import AgregarParametros from "@/components/nueva-calculadora/AgregarParametros";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import FormInput from "@/components/ui/form-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "@/lib/es-zod";
import { crearCalculadoraAction } from "@/utils/actions";
import { CATEGORIAS, Parametro } from "@/utils/types";
import CalculadoraSchema from "@/validationSchemas/CalculadoraSchema";
import { useToast } from "@/zustand/Toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

const FormularioNuevaCalculadora = ({ parametros }: { parametros: Parametro[] | undefined }) => {
  const { addToast } = useToast();
  const form = useForm<z.infer<typeof CalculadoraSchema>>({
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

  function onSubmit(values: z.infer<typeof CalculadoraSchema>) {
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex min-h-screen md:max-w-screen-md lg:max-w-screen-lg flex-col items-center justify-between rounded-lg p-24 py-12 bg-white gap-16"
      >
        <div className="w-full flex flex-col gap-6">
          <h2 className="w-full text-xl font-semibold text-center leading-none">Información general</h2>
          <fieldset className="w-full flex flex-col gap-2">
            <FormInput
              control={form.control}
              name="nombre"
              label="Título"
              placeholder="Ingrese el título de la calculadora"
              input="input"
            />
          </fieldset>

          <fieldset className="w-full flex flex-col gap-2">
            <FormField
              name='categoria'
              render={({ field }) => (<>
                <FormItem>
                  <FormLabel>Area</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el area" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <Each of={CATEGORIAS} render={(categoria) => (
                        <SelectItem key={categoria.kebabCase} value={categoria.kebabCase}>{categoria.nombre}</SelectItem>
                      )} />
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    El area a la que pertenece la calculadora
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              </>
              )}
            />
          </fieldset>

          <fieldset className="w-full flex flex-col gap-2">
            <FormField
              control={form.control}
              name='parametros'
              render={({ field }) => (<>
                <FormItem>
                  <FormLabel>Parametros</FormLabel>
                  <Select
                    onValueChange={
                      (value) => {
                        const parametro = parametros?.find((parametro) => parametro.id === parseInt(value));
                        if (parametro) {
                          form.setValue('parametros', [...field.value, parametro]);
                        }
                      }
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el area" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <Each of={parametros!} render={(parametro) => (
                        <SelectItem key={parametro.id} value={parametro.id.toString()}>{parametro.nombre}</SelectItem>
                      )} />
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    El area a la que pertenece la calculadora
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              </>
              )}
            />
          </fieldset>

          <fieldset className="w-full flex flex-col gap-2">
            <FormInput
              control={form.control}
              name="descripcion"
              label="Descripción"
              placeholder="Ingrese una descripción de la calculadora"
              input="textarea"
            />
          </fieldset>
          <fieldset className="w-full flex flex-col gap-2">
            <FormInput
              control={form.control}
              name="descripcion_corta"
              label="Descripción corta"
              placeholder="Ingrese una descripción corta de la calculadora"
              input="textarea"
              description="Esta descripción se mostrará en la lista de calculadoras"
            />
          </fieldset>
          <fieldset className="w-full flex flex-col gap-2">
            <FormInput
              control={form.control}
              name="resultados_recomendaciones"
              label="Resultados y recomendaciones"
              placeholder="Ingrese resultados y recomendaciones de la calculadora"
              input="textarea"
            />
          </fieldset>

          <fieldset className="w-full flex flex-col gap-2">
            {/* <label htmlFor="enlace">Enlace</label>
            <input
              type="text"
              id="enlace"
              name="enlace"
              placeholder="Enlace a la calculadora (por defecto es el nombre en kebab case)"
              className="rounded-lg"
            /> */}
          </fieldset>
          <FormInput name="evidencias" control={form.control} label="Evidencias" input="input" textInputProps={{ hidden: true }} />

          <AgregarEvidencias />

        </div>

        <fieldset className="w-full flex flex-col gap-2">

        </fieldset>


        <div className="w-full flex flex-col gap-6">
          <FormInput name="parametros" control={form.control} label="Parámetros" input="input" textInputProps={{ hidden: true }} />

          {Array.isArray(parametros) ? <AgregarParametros listaParametros={parametros ? parametros : [] as Parametro[]} />
            : <p>Cargando...</p>}

          <fieldset className="w-full">
            <FormInput
              control={form.control}
              name="formula"
              label="Fórmula"
              placeholder="Ingrese la fórmula de la calculadora"
              input="textarea"
            />
          </fieldset>
        </div>

        <Button type="submit">
          <Save />
          Guardar calculadora
        </Button>
      </form>
    </Form>
  );
}

export default FormularioNuevaCalculadora;