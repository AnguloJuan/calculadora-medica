import { actualizarCalculadoraAction } from "@/utils/actions";
import CalculadoraSchema, { TypeCalculadoraSchema } from "@/validationSchemas/CalculadoraSchema";
import { TypeParametroSchema } from "@/validationSchemas/ParametroSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import DialogItem from "../DialogItem";
import FormularioCalculadora from "../formularios/FormularioCalculadora";
import { useToast } from "../Toast";
import { Button } from "../ui/button";
import { DialogClose, DialogTitle } from "../ui/dialog";


const ActualizarCalculadora = ({ calculadora, parametros }: { calculadora: TypeCalculadoraSchema, parametros: TypeParametroSchema[] }) => {
  const { addToast } = useToast();
  const router = useRouter();

  const initialValues: TypeCalculadoraSchema = {
    id: calculadora.id,
    nombre: calculadora.nombre,
    descripcion: calculadora.descripcion,
    descripcion_corta: calculadora.descripcion,
    resultados_recomendaciones: calculadora.resultados_recomendaciones,
    categoria: calculadora.categoria,
    enlace: calculadora.enlace,
    formula: calculadora.formula,
    evidencias: calculadora.evidencias,
    parametros: calculadora.parametros,
  }

  const form = useForm<TypeCalculadoraSchema>({
    resolver: zodResolver(CalculadoraSchema),
    mode: 'onBlur',
    defaultValues: initialValues
  })

  const onSubmit = async (data: TypeCalculadoraSchema) => {
    const output = await form.trigger();
    if (!output) return;

    const calculadora = form.getValues();
    const formData = new FormData();
    formData.append('id', calculadora.id.toString());
    formData.append('nombre', calculadora.nombre);
    formData.append('descripcion', calculadora.descripcion);
    formData.append('descripcion_corta', calculadora.descripcion_corta || '');
    formData.append('resultados_recomendaciones', calculadora.resultados_recomendaciones || '');
    formData.append('categoria', calculadora.categoria);
    formData.append('formula', calculadora.formula);
    formData.append('enlace', calculadora.enlace || '');
    formData.append('parametros', JSON.stringify(calculadora.parametros));
    formData.append('evidencias', JSON.stringify(calculadora.evidencias));

    try {
      const response = await actualizarCalculadoraAction(formData);
      if (response.error) {
        addToast('Error al actualizar la calculadora', 'error');
        return;
      }
      addToast('Calculadora actualizada', 'success');
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <DialogItem triggerChildren="Editar" className={'top-[50%] -bottom-[40%] overflow-y-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl px-20 py-12'}>
      <DialogTitle className="text-3xl font-semibold tracking-tight first:mt-0">Actualizar calculadora</DialogTitle>
      {/* <DialogDescription>
        Editar calculadora.
      </DialogDescription> */}
      <FormularioCalculadora form={form} parametros={parametros} />
      <div className="flex flex-row justify-between gap-4">
        <DialogClose asChild>
          <Button variant="default" className="w-full"><X />Cancelar</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button type="button" variant="warning" className="w-full" onClick={() => onSubmit}><Edit />Actualizar</Button>
        </DialogClose>
      </div>
    </DialogItem>
  )
}

export default ActualizarCalculadora;