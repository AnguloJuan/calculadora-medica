import { actualizarParametroAction } from "@/utils/actions";
import { ParametroSchema, TypeParametroSchema } from "@/validationSchemas/ParametroSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import DialogItem from "../DialogItem";
import FormularioParametro from "../formularios/FormularioParametro";
import { useToast } from "../Toast";
import { Button } from "../ui/button";
import { DialogClose, DialogDescription, DialogTitle } from "../ui/dialog";


const ActualizarParametroTabla = ({ parametro }: { parametro: TypeParametroSchema }) => {
  const { addToast } = useToast();
  const router = useRouter();

  const initialValues: TypeParametroSchema = parametro.tipo_campo === 'numerico' ? {
    id: parametro.id,
    nombre: parametro.nombre,
    tipo_campo: parametro.tipo_campo,
    unidades: parametro.unidades,
    valorMinimo: parametro.valorMinimo as any,
    valorMaximo: parametro.valorMaximo as any,
  } : {
    id: parametro.id,
    nombre: parametro.nombre,
    tipo_campo: parametro.tipo_campo,
    opciones: parametro.opciones,
  }

  const form = useForm<TypeParametroSchema>({
    resolver: zodResolver(ParametroSchema),
    mode: 'onBlur',
    defaultValues: initialValues
  })

  const onSubmit = async () => {
    const output = await form.trigger();
    if (!output) return;

    const parametro = form.getValues();
    async function actualizarParametro() {
      const formData = new FormData();
      formData.append('id', parametro.id.toString());
      formData.append('nombre', parametro.nombre);
      formData.append('tipo_campo', parametro.tipo_campo);
      formData.append('abreviatura', parametro.abreviatura || '');
      if (parametro.tipo_campo === 'numerico') {
        formData.append('valorMinimo', parametro.valorMinimo?.toString() || '');
        formData.append('valorMaximo', parametro.valorMaximo?.toString() || '');
        formData.append('unidades', JSON.stringify(parametro.unidades));
      }
      if (parametro.tipo_campo === 'seleccion' || parametro.tipo_campo === 'radio') formData.append('opciones', parametro.opciones || '');

      const response = await actualizarParametroAction(formData);
      if (response.error) {
        addToast('Error al actualizar el parámetro', 'error');
        return;
      }
      addToast('Parámetro actualizado', 'success');
      router.refresh();
    }
    actualizarParametro();
  }


  return (
    <DialogItem triggerChildren="Editar" className={'top-[50%] -bottom-[40%] overflow-y-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl px-20 py-12'}>
      <DialogTitle className="text-3xl font-semibold tracking-tight first:mt-0">Actualizar parámetro</DialogTitle>
      <DialogDescription>Los cambios afectaran a TODAS las calculadoras que usen este parámetro.</DialogDescription>
      <FormularioParametro form={form} />
      <div className="flex flex-row justify-between gap-4">
        <DialogClose asChild>
          <Button variant="default" className="w-full" onClick={() => form.reset()}><X />Cancelar</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button type="button" variant="warning" className="w-full" onClick={() => onSubmit()}><Edit />Actualizar</Button>
        </DialogClose>
      </div>
    </DialogItem>
  )
}

export default ActualizarParametroTabla;