import { Unidad } from "@/utils/types"
import { TypeParametroSchema } from "@/validationSchemas/ParametroSchema"
import { useEffect, useState } from "react"
import { UseFormReturn } from "react-hook-form"
import Select, { MultiValue } from "react-select"
import CampoParametro from "../parametros/CampoParametro"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import FormInput from "../ui/form-input"
import { Select as MSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Separator } from "../ui/separator"
import CrearUnidad from "../unidades/CrearUnidad"

type ParametroFields = TypeParametroSchema
type UnidadOption = { value: Unidad, label: string }

const FormularioParametro = ({ form }: {
  form: UseFormReturn<ParametroFields>,
}) => {
  const [Unidades, setUnidades] = useState<{ value: Unidad, label: string }[]>([])
  const fields = form.watch()

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
              <MSelect onValueChange={(value) => {
                value === "numerico" && form.resetField("opciones");
                if (value === "seleccion" || value === "radio") {
                  form.resetField("valorMinimo")
                  form.resetField("valorMaximo")
                  form.resetField("unidades")
                }
                field.onChange(value)
              }} defaultValue={field.value}>
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
        {fields.tipo_campo === 'numerico' && (<>
          <FormField
            control={form.control}
            name='unidades'
            render={({ field }) => (<>
              <FormItem>
                <FormLabel>Parametros</FormLabel>
                <div className="flex flex-row gap-2 w-full justify-between items-center">
                  <FormControl>
                    <Select
                      value={field.value?.map((unidad: Unidad) => ({ value: unidad, label: unidad.unidad }))}
                      options={Unidades}
                      noOptionsMessage={() => 'No hay unidades disponibles'}
                      isMulti
                      onChange={(value: MultiValue<UnidadOption>) => {
                        field.onChange(value.map((unidad) => unidad.value))
                      }}
                      className="w-full border border-border rounded-lg bg-input text-foreground focus:ring focus:ring-ring focus:ring-opacity-50 flex-grow"
                      styles={{
                        control: (styles) => ({ ...styles, backgroundColor: 'Background' }),
                        option: (styles, { isSelected }) => ({ ...styles, backgroundColor: isSelected ? 'ActiveCaption' : 'InactiveCaption', color: isSelected ? 'ActiveCaption' : 'foreground', ":hover": { backgroundColor: 'ButtonHighlight', color: 'ActiveCaptionText' } }),
                        multiValue: (styles) => ({ ...styles, backgroundColor: 'accent', color: 'accent-foreground' }),
                        multiValueLabel: (styles) => ({ ...styles, color: 'foreground', }),
                        multiValueRemove: (styles) => ({ ...styles, color: 'accent-foreground', ':hover': { backgroundColor: 'destructive', color: 'destructive-foreground' } }),
                        input: (styles) => ({ ...styles, color: 'foreground' }),
                        menu: (styles) => ({ ...styles, backgroundColor: 'Background', color: 'foreground' }),
                      }}
                    />
                  </FormControl>
                  <CrearUnidad />
                </div>
                <FormDescription>
                  La/las unidad/unidades en las que se mide el parámetro
                </FormDescription>
                <FormMessage />
              </FormItem>
            </>
            )}
          />
          <div className="flex flex-row gap-4">
            <FormInput
              control={form.control}
              name="valorMinimo"
              label="Valor mínimo"
              placeholder="Valor mínimo"
              textInputProps={{
                type: 'number',
                value: fields.valorMinimo !== null ? String(fields.valorMinimo) : '',
                onChange: (e) => e.target.value !== "" ? form.setValue("valorMinimo", e.target.valueAsNumber) : form.setValue("valorMinimo", "" as any)
              }}
            />
            <FormInput
              control={form.control}
              name="valorMaximo"
              label="Valor máximo"
              placeholder="Valor máximo"
              textInputProps={{
                type: 'number',
                value: fields.valorMaximo !== null ? String(fields.valorMaximo) : '',
                onChange: (e) => e.target.value !== "" ? form.setValue("valorMaximo", e.target.valueAsNumber) : form.setValue("valorMaximo", "" as any)
              }}
            />
          </div>
        </>)}

        {(fields.tipo_campo === 'seleccion' || fields.tipo_campo === 'radio') && (<>
          <FormInput
            control={form.control}
            name="opciones"
            label="Opciones"
            placeholder="Opciones separadas por coma"
          />
        </>)}
      </form>
      <Separator />
      <small className="text-muted-foreground">Vista previa:</small>
      <div className="mt-2">
        <CampoParametro parametro={{
          ...fields
        }} />
      </div>
    </Form>
  </>)
}

export default FormularioParametro