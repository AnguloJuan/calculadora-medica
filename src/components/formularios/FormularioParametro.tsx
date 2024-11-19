import { Control, FormProps, FormState, UseFormReturn } from "react-hook-form"
import { Form } from "../ui/form"
import { ParametroSchema } from "@/validationSchemas/ParametroSchema"
import { z } from "@/lib/es-zod"
import FormInput from "../ui/form-input"

type ParametroFields = z.infer<typeof ParametroSchema>

const FormularioParametro = ({ form, onSubmit }: {
  form: UseFormReturn<ParametroFields>,
  onSubmit: (data: ParametroFields) => void
}) => {

  return (<>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormInput
          control={form.control}
          name="nombre"
          label="Parametro"
          placeholder="Nombre del parametro"
        />
      </form>
    </Form>
  </>)
}

export default FormularioParametro