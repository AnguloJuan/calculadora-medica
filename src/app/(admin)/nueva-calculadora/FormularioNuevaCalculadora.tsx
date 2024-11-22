"use client"

import CampoParametro from "@/components/CampoParametro";
import CrearParametro from "@/components/parametros/CrearParametro";
import { Each } from "@/components/EachOf";
import ListaParametros from "@/components/ListaParametros";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import FormInput from "@/components/ui/form-input";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { z } from "@/lib/es-zod";
import { crearCalculadoraAction } from "@/utils/actions";
import { CATEGORIAS } from "@/utils/types";
import CalculadoraSchema from "@/validationSchemas/CalculadoraSchema";
import EvidenciaSchema from "@/validationSchemas/EvidenciaSchema";
import { TypeParametroSchema } from "@/validationSchemas/ParametroSchema";
import { useToast } from "@/zustand/Toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Pencil, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

type parametrosConUnidades = TypeParametroSchema[]
const FormularioNuevaCalculadora = ({ parametros }: { parametros: parametrosConUnidades | undefined }) => {
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

  const {
    formState: { errors },
    register,
    handleSubmit,
    control,
    setValue,
    watch,
  } = form;

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

  const { fields: parametrosFields, append: appendParametros, remove: removeParametros } = useFieldArray({
    name: "parametros",
    control: control
  });
  const { fields: evidencias, append: appendEvidencia, remove: removeEvidencia } = useFieldArray({
    name: "evidencias",
    control: control
  });
  type Evidencia = z.infer<typeof EvidenciaSchema>;
  const [evidencia, setEvidencia] = useState<Evidencia>({
    cita: "",
    enlace: ""
  });

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex min-h-screen md:max-w-screen-md lg:max-w-screen-lg w-full flex-col items-center justify-between rounded-lg p-24 py-12 bg-white gap-16"
      >
        <div className="w-full flex flex-col gap-4">
          <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">Información general</h2>
          <FormInput
            control={control}
            name="nombre"
            label="Título"
            placeholder="Ingrese el título de la calculadora"
          />

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


          <FormField
            control={control}
            name='parametros'
            render={({ field }) => (<>
              <FormItem>
                <h2 className="scroll-m-20 text-lg font-semibold tracking-tight">Parametros</h2>
                <div className="flex flex-row gap-2">
                  <Select
                    onValueChange={
                      (value: string) => {
                        const parametro = parametros?.find((parametro) => parametro.id === parseInt(value));
                        const parametroExistente = field.value.find((param) => param.id === parametro?.id);
                        if (parametro && !parametroExistente) {
                          setValue('parametros', [...field.value, { ...parametro }]);
                        }
                      }
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un parametro" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <Each of={parametros!} render={(parametro) => (
                        <SelectItem key={parametro.id} value={parametro.id.toString()}>{parametro.nombre}</SelectItem>
                      )} />
                    </SelectContent>
                  </Select>
                  <CrearParametro />
                </div>
                <FormDescription>
                  Agrega parametros a la calculadora
                </FormDescription>
                <FormMessage />
              </FormItem>
            </>
            )}
          />

          {parametrosFields.map((field, index) => {
            return (
              <div key={field.id} className="flex flex-row items-center gap-4">
                <CampoParametro key={field.id} parametro={field} />
                <Button type="button" variant={'warning'} onClick={() => {}}>
                  <Pencil />
                </Button>
                <Button type="button" variant={'destructive'} onClick={() => removeParametros(index)}>
                  <Trash2 />
                </Button>
              </div>
            );
          })}

          <FormInput
            control={control}
            name="formula"
            label="Fórmula"
            placeholder="Ingrese la fórmula de la calculadora"
            input="textarea"
          />

          <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">Detalles</h2>
          <FormInput
            control={control}
            name="descripcion"
            label="Descripción"
            placeholder="Ingrese una descripción de la calculadora"
            input="textarea"
          />
          <FormInput
            control={control}
            name="descripcion_corta"
            label="Descripción corta"
            placeholder="Ingrese una descripción corta de la calculadora"
            input="textarea"
            description="Esta descripción se mostrará en la lista de calculadoras"
          />
          <FormInput
            control={control}
            name="resultados_recomendaciones"
            label="Resultados y recomendaciones"
            placeholder="Ingrese resultados y recomendaciones de la calculadora"
            input="textarea"
          />

          <FormItem>
            <h2 className="scroll-m-20 text-lg font-semibold tracking-tight">Evidencias</h2>
            <FormLabel htmlFor="cita">Cita</FormLabel>
            <Textarea
              name="cita"
              value={evidencia.cita}
              onChange={(e) => setEvidencia({ ...evidencia, cita: e.target.value })}
              placeholder="Cita de la evidencia en formato APA"
            />
          </FormItem>
          <FormItem>
            <FormLabel htmlFor="enlace">Enlace</FormLabel>
            <Input
              type="url"
              name="enlace"
              value={evidencia.enlace}
              onChange={(e) => setEvidencia({ ...evidencia, enlace: e.target.value })}
              placeholder="Enlace de la calculadora"
            />
          </FormItem>
          <Button
            type="button"
            onClick={() => {
              if (evidencia.cita === "" || evidencia.enlace === "") {
                return;
              }
              appendEvidencia(evidencia);
              setEvidencia({
                cita: "",
                enlace: ""
              });
            }}
          >
            Agregar evidencia
          </Button>
          {evidencias.map((field, index) => {
            return (
              <div key={field.id} className="flex flex-row items-center gap-4">
                <Card key={field.id}>
                  <Link href={field.enlace} passHref>
                    <CardContent className="py-4 flex flex-row gap-4">
                      <div className="self-center">
                        <FileText />
                      </div>
                      <p className="text-blue-500 cursor-pointer hover:text-blue-700 transition-colors">{field.cita}</p>
                    </CardContent>
                  </Link>
                </Card>
                <Button type="button" variant={'destructive'} onClick={() => removeEvidencia(index)}>
                  <Trash2 />
                </Button>
              </div>
            );
          })}

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