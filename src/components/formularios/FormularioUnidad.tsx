"use client"
import { z } from "@/lib/es-zod"
import { Unidad } from "@/utils/types"
import UnidadSchema from "@/validationSchemas/UnidadSchema"
import { useEffect, useState } from "react"
import { UseFormReturn } from "react-hook-form"
import Select from "react-select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import FormInput from "../ui/form-input"

type UnidadFields = z.infer<typeof UnidadSchema>

const FormularioUnidad = ({ form }: {
  form: UseFormReturn<UnidadFields>
}) => {
  const idUnidadConversion = form.watch('id_unidad_conversion', null)
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
      <form className="space-y-2">
        <FormInput
          control={form.control}
          name="unidad"
          label="Unidad"
          placeholder="Nombre de la unidad"
        />

        <FormField
          control={form.control}
          name='id_unidad_conversion'
          render={({ field }) => (<>
            <FormItem>
              <FormLabel>Unidad de conversión</FormLabel>
              <div className="flex flex-row gap-2 w-full">
                <FormControl>
                  <Select
                    value={Unidades.find((unidad) => unidad.value.id === field.value) || null}
                    options={Unidades}
                    noOptionsMessage={() => 'No hay unidades disponibles'}
                    onChange={(option) => field.onChange(option ? option.value.id : null)}
                    className="w-full border border-border rounded-lg bg-input text-foreground focus:ring focus:ring-ring focus:ring-opacity-50"
                    styles={{
                      control: (styles) => ({ ...styles, backgroundColor: 'Background' }),
                      option: (styles, { isSelected }) => ({ ...styles, backgroundColor: isSelected ? 'ButtonHighlight' : 'InactiveCaption', color: isSelected ? 'ActiveCaptionText' : 'CaptionText', ":hover": { backgroundColor: 'ButtonHighlight', color: 'ActiveCaptionText' } }),
                      input: (styles) => ({ ...styles, color: 'foreground' }),
                      singleValue: (styles) => ({ ...styles, color: 'foreground' }),
                      menu: (styles) => ({ ...styles, backgroundColor: 'Background', color: 'foreground' }),
                    }}
                  />
                </FormControl>
              </div>
              <FormDescription>
                La unidad a la que se puede convertir
              </FormDescription>
              <FormMessage />
            </FormItem>
          </>
          )}
        />
        {idUnidadConversion &&
          <FormInput
            control={form.control}
            name="conversion"
            label="Conversión"
            placeholder="Ingrese la conversión de la unidad"
            description="Ingrese la conversión de la unidad a la unidad de conversión ej. 1 m = 100 cm entonces la conversión es /100"
          />
        }
      </form>
    </Form>
  </>)
}

export default FormularioUnidad