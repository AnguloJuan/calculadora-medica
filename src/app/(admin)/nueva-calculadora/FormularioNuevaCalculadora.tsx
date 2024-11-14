"use client"
import { Each } from "@/components/EachOf";
import AgregarEvidencias from "@/components/nueva-calculadora/AgregarEvidencias";
import AgregarParametros from "@/components/nueva-calculadora/AgregarParametros";
import BotonGuardarCalculadora from "@/components/nueva-calculadora/BotonGuardarCalculadora";
import FormInput from "@/components/ui/MInputForm";
import { z } from "@/lib/es-zod";
import { CATEGORIAS, Parametro } from "@/utils/types";
import CalculadoraSchema from "@/validationSchemas/CalculadoraSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function FormularioNuevaCalculadora({ parametros }: { parametros: Parametro[] | undefined }) {
  const form = useForm<z.infer<typeof CalculadoraSchema>>({
    resolver: zodResolver(CalculadoraSchema),
    defaultValues: {
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
  return (
    <form
      id="form_calculadora"
      name="form_calculadora"
      className="flex min-h-screen md:max-w-screen-md lg:max-w-screen-lg flex-col items-center justify-between rounded-lg p-24 py-12 bg-white gap-16"
    >
      <div className="w-full flex flex-col gap-6">
        <h2 className="w-full text-xl font-semibold text-center">Información general</h2>
        <fieldset className="w-full flex flex-col gap-2">
          <FormInput
          
          >
        </fieldset>
        <fieldset className="w-full flex flex-col gap-2">
          <span>Descripción</span>
          <textarea
            id="descripcion"
            name="descripcion"
            placeholder="Ingrese una descripcion de la calculadora"
            autoComplete="on"
            className="bg-white"
          ></textarea>
        </fieldset>
        <fieldset className="w-full flex flex-col gap-2">
          <label htmlFor="descripcion_corta">Descripcion corta</label>
          <input
            type="text"
            id="descripcion_corta"
            name="descripcion_corta"
            placeholder="Ingrese una descipción corta de la calculadora"
            className="rounded-lg"
          />
        </fieldset>
        <fieldset className="w-full flex flex-col gap-2">
          <span>Resultados/Recomendaciones</span>
          <textarea
            name="resultados_recomendaciones"
            id="resultados_recomendaciones"
            placeholder="Ingrese recomendaciones de la calculadora"
            autoComplete="on"
            className="bg-white"
          ></textarea>
        </fieldset>

        <fieldset className="w-full flex flex-col gap-2">
          <label htmlFor="categoria">Categoria a la que pertenece la calculadora</label>
          <select
            id="categoria"
            name="categoria"
            className="rounded-lg"
          >
            <Each
              of={CATEGORIAS}
              render={(categoria) => (
                <option value={categoria.kebabCase}>{categoria.nombre}</option>
              )}
            />
          </select>
        </fieldset>
        <fieldset className="w-full flex flex-col gap-2">
          <label htmlFor="enlace">Enlace</label>
          <input
            type="text"
            id="enlace"
            name="enlace"
            placeholder="Enlace a la calculadora (por defecto es el nombre en kebab case)"
            className="rounded-lg"
          />
        </fieldset>

        <AgregarEvidencias />

      </div>


      <div className="w-full flex flex-col gap-6">
        <h2 className="w-full text-xl font-semibold text-center">Parámetros</h2>

        {Array.isArray(parametros) ? <AgregarParametros listaParametros={parametros ? parametros : [] as Parametro[]} />
          : <p>Cargando...</p>}

        <fieldset className="w-full">
          <label htmlFor="formula">Formula</label>
          <input
            type="text"
            name="formula"
            id="formula"
            placeholder="Ingrese la formula"
            className="rounded-lg"
          />
        </fieldset>
      </div>

      <BotonGuardarCalculadora />
    </form>
  );
}