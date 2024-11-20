import { Control, FormProps, FormState, useController, UseFormReturn } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { ParametroSchema } from "@/validationSchemas/ParametroSchema"
import { z } from "@/lib/es-zod"
import FormInput from "../ui/form-input"
import Select from "react-select";
import { useEffect, useState } from "react"
import { Unidad } from "@/utils/types"
import { Select as MSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { DialogClose, DialogFooter } from "../ui/dialog"
import { Button } from "../ui/button"

type ParametroFields = z.infer<typeof ParametroSchema>

const FormularioParametro = ({ formParametro, submitParametro }: {
  formParametro: UseFormReturn<ParametroFields>,
  submitParametro: (data: ParametroFields) => void
}) => {
  const { field: tipoCampo } = useController({ name: 'tipo_campo', 'control': formParametro.control })
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
    <Form {...formParametro}>
      <form>
        <FormInput
          control={formParametro.control}
          name="nombre"
          label="Parametro"
          placeholder="Nombre del parametro"
        />
        <FormField
          control={formParametro.control}
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
              control={formParametro.control}
              name='unidades'
              render={({ field }) => (<>
                <FormItem>
                  <FormLabel>Parametros</FormLabel>
                  <div className="flex flex-row gap-2 w-full">
                    <FormControl>
                      <Select
                        {...field}
                        options={Unidades}
                        noOptionsMessage={() => 'No hay unidades disponibles'}
                        isMulti
                        onChange={(value: any) => formParametro.setValue('unidades', value)}
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
              control={formParametro.control}
              name="valorMinimo"
              label="Valor mínimo"
              placeholder="Valor mínimo"
            />
            <FormInput
              control={formParametro.control}
              name="valorMaximo"
              label="Valor máximo"
              placeholder="Valor máximo"
            />
          </div>
        </>)}

        {(tipoCampo.value === 'seleccion' || tipoCampo.value === 'radio') && (<>
          <FormInput
            control={formParametro.control}
            name="opciones"
            label="Opciones"
            placeholder="Opciones separadas por coma"
          />
        </>)}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={()=> submitParametro(formParametro.getValues())}>Save changes</Button>
        </DialogFooter>
      </form>
    </Form>
  </>)
}

export default FormularioParametro