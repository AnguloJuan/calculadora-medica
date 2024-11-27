"use client"

import CampoParametro from "@/components/CampoParametro";
import { Each } from "@/components/EachOf";
import ActualizarParametro from "@/components/parametros/ActualizarParametro";
import CrearParametro from "@/components/parametros/CrearParametro";
import { useToast } from "@/components/Toast";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Plus, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import ReactSelect from "react-select";

type parametrosConUnidades = TypeParametroSchema[]

const FormularioNuevaCalculadora = ({ parametros: params }: { parametros: parametrosConUnidades | undefined }) => {
  const { addToast } = useToast();
  const [parametros, setParametros] = useState<TypeParametroSchema[]>(params || []);
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

  const parametroOptions = useMemo(() => parametros.map((parametro) => ({
    value: parametro,
    label: parametro.nombre
  })), [parametros]);

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex min-h-screen md:max-w-screen-md lg:max-w-screen-lg w-full flex-col items-center justify-between bg-container border shadow rounded-lg p-24 py-12 gap-16"
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
                  {/* <ReactSelect
                    value={parametros.find((parametro) => parametro.id === field.value) || null}
                    options={parametroOptions}
                    noOptionsMessage={() => 'No hay parametros disponibles'}
                    onChange={(option) => field.onChange(option ? option.value.id : null)}
                    className="w-full border border-border rounded-lg bg-input text-foreground focus:ring focus:ring-ring focus:ring-opacity-50"
                    styles={{
                      control: (styles) => ({ ...styles, backgroundColor: 'Background' }),
                      option: (styles, { isSelected }) => ({ ...styles, backgroundColor: isSelected ? 'ButtonHighlight' : 'InactiveCaption', color: isSelected ? 'ActiveCaptionText' : 'CaptionText', ":hover": { backgroundColor: 'ButtonHighlight', color: 'ActiveCaptionText' } }),
                      input: (styles) => ({ ...styles, color: 'foreground' }),
                      singleValue: (styles) => ({ ...styles, color: 'foreground' }),
                      menu: (styles) => ({ ...styles, backgroundColor: 'Background', color: 'foreground' }),
                    }}
                  /> */}
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
                  <CrearParametro setParametros={setParametros} />
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
              <div key={field.id} className="flex flex-row items-end gap-4">
                <CampoParametro key={field.id} parametro={field} />
                <ActualizarParametro parametro={field} setParametros={setParametros} />
                <Button type="button" variant='destructive' onClick={() => removeParametros(index)}>
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
            variant='outline'
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
            className="w-fit"
          >
            <div className="flex flex-row">
              <Plus className="pr-0 mr-0" />
              <FileText className="pl-0 ml-0 leading-none" />
            </div>
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

        <Button type="submit" variant={'success'} className="w-full">
          <Save />
          Guardar calculadora
        </Button>
      </form>
    </Form>
  );
}

export default FormularioNuevaCalculadora;