import { z } from "@/lib/es-zod"
import { Unidad } from "@/utils/types"
import { ParametroSchema } from "@/validationSchemas/ParametroSchema"
import { useEffect, useState } from "react"
import { useController, UseFormReturn } from "react-hook-form"
import Select, { MultiValue } from "react-select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import FormInput from "../ui/form-input"
import { Select as MSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

type ParametroFields = z.infer<typeof ParametroSchema>
type UnidadOption = { value: Unidad, label: string }

const FormularioParametro = ({ form, onSubmit }: {
  form: UseFormReturn<ParametroFields>,
  onSubmit: (data: ParametroFields) => void
}) => {
  const { field: tipoCampo } = useController({ name: 'tipo_campo', control: form.control })
  const { field: valorMinimo } = useController({ name: 'valorMinimo', control: form.control })
  const { field: valorMaximo } = useController({ name: 'valorMaximo', control: form.control })
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
          name="nombre"
          label="Parametro"
          placeholder="Nombre del parametro"
        />
        <FormField
          control={form.control}
          name="tipo_campo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de campo</FormLabel>
              <MSelect onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccióna el tipo de campo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="numerico">Numérico</SelectItem>
                  <SelectItem value="seleccion">Selección</SelectItem>
                  <SelectItem value="radio">Radio</SelectItem>
                </SelectContent>
              </MSelect>
              <FormMessage />
            </FormItem>
          )}
        />
        {tipoCampo.value === 'numerico' && (<>
          <div className="flex flex-row gap-2">
            <FormField
              control={form.control}
              name='unidades'
              render={({ field }) => (<>
                <FormItem>
                  <FormLabel>Parametros</FormLabel>
                  <div className="flex flex-row gap-2 w-full">
                    <FormControl>
                      <Select
                        value={field.value?.map((unidad: Unidad) => ({ value: unidad, label: unidad.unidad }))}
                        options={Unidades}
                        noOptionsMessage={() => 'No hay unidades disponibles'}
                        isMulti
                        onChange={(value: MultiValue<UnidadOption>) => {
                          field.onChange(value.map((unidad) => unidad.value))
                        }}
                        className="w-full"
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
              name="valorMinimo"
              label="Valor mínimo"
              placeholder="Valor mínimo"
              textInputProps={{
                type: 'number',
                value: valorMinimo.value !== null ? String(valorMinimo.value) : '',
                onChange: (e) => e.target.value !== "" ? valorMinimo.onChange(e.target.valueAsNumber) : valorMinimo.onChange("")
              }}
            />
            <FormInput
              control={form.control}
              name="valorMaximo"
              label="Valor máximo"
              placeholder="Valor máximo"
              textInputProps={{
                type: 'number',
                value: valorMaximo.value !== null ? String(valorMaximo.value) : '',
                onChange: (e) => e.target.value !== "" ? valorMaximo.onChange(e.target.valueAsNumber) : valorMaximo.onChange("")
              }}
            />
          </div>
        </>)}

        {(tipoCampo.value === 'seleccion' || tipoCampo.value === 'radio') && (<>
          <FormInput
            control={form.control}
            name="opciones"
            label="Opciones"
            placeholder="Opciones separadas por coma"
          />
        </>)}
      </form>
    </Form>
  </>)
}

export default FormularioParametro