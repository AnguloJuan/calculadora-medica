import { z } from "@/lib/es-zod"
import { Unidad } from "@/utils/types"
import UnidadSchema from "@/validationSchemas/UnidadSchema"
import { useEffect, useState } from "react"
import { useController, UseFormReturn } from "react-hook-form"
import Select, { MultiValue } from "react-select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import FormInput from "../ui/form-input"
import { Select as MSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

type UnidadFields = z.infer<typeof UnidadSchema>
type UnidadOption = { value: Unidad, label: string }

const FormularioUnidad = ({ form, onSubmit }: {
  form: UseFormReturn<UnidadFields>,
  onSubmit: (data: UnidadFields) => void
}) => {
  const { field: idUnidadConversion } = useController({ name: 'id_unidad_conversion', control: form.control })
  const { field: conversion } = useController({ name: 'conversion', control: form.control })
  const [Unidades, setUnidades] = useState<{ value: Unidad, label: string }[]>([])


  useEffect(() => {
    const obtenerUnidades = async () => {
      const response = await fetch('/api/unidades')
      const data = await response.json()

      setUnidades(data.unidades.map((unidad: Unidad) => ({ value: unidad, label: unidad.unidad })))
    }
    obtenerUnidades()
  }, [])

  return (<>
    <Form {...form}>
      <form>
        <FormInput
          control={form.control}
          name="unidad"
          label="Unidad"
          placeholder="Nombre de la unidad"
        />

        <div className="flex flex-row gap-2">
          <FormField
            control={form.control}
            name='id_unidad_conversion'
            render={({ field }) => (<>
              <FormItem>
                <FormLabel>Parametros</FormLabel>
                <div className="flex flex-row gap-2 w-full">
                  <FormControl>
                    <Select
                      value={Unidades.find((unidad) => unidad.value.id === idUnidadConversion.value)}
                      options={Unidades}
                      noOptionsMessage={() => 'No hay unidades disponibles'}
                      onChange={(value) => {
                        idUnidadConversion.onChange(value?.value)
                      }}
                      className="w-full border border-border rounded-lg bg-input text-foreground focus:ring focus:ring-ring focus:ring-opacity-50"
                      styles={{
                        control: (styles) => ({ ...styles, backgroundColor: 'Background' }),
                        option: (styles, { isSelected }) => ({ ...styles, backgroundColor: isSelected ? 'ActiveCaption' : 'InactiveCaption', color: isSelected ? 'ActiveCaption' : 'foreground', ":hover": { backgroundColor: 'ButtonHighlight', color: 'ActiveCaptionText' } }),
                        multiValue: (styles) => ({ ...styles, backgroundColor: 'accent', color: 'accent-foreground' }),
                        multiValueLabel: (styles) => ({ ...styles, color: 'foreground', }),
                        multiValueRemove: (styles) => ({ ...styles, color: 'accent-foreground', ':hover': { backgroundColor: 'destructive', color: 'destructive-foreground' } }),
                        input: (styles) => ({ ...styles, color: 'foreground' }),
                        // singleValue: (styles) => ({ ...styles, color: 'foreground' }),
                        // container: (styles) => ({ ...styles, width: '100%', color: 'foreground', backgroundColor: 'input' }),
                        menu: (styles) => ({ ...styles, backgroundColor: 'Background', color: 'foreground' }),
                      }}
                    />
                  </FormControl>
                </div>
                <FormDescription>
                  El area a la que pertenece la calculadora
                </FormDescription>
                <FormMessage />
              </FormItem>
            </>
            )}
          />
        </div>
        <div className="flex flex-row gap-4">
          <FormInput
            control={form.control}
            name="conversion"
            label="Conversión"
            placeholder="Ingrese la conversión de la unidad"
          />
        </div>
      </form>
    </Form>
  </>)
}

export default FormularioUnidad