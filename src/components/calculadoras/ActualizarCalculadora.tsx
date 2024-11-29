import { actualizarCalculadoraAction, eliminarCalculadoraAction } from "@/utils/actions";
import CalculadoraSchema, { TypeCalculadoraSchema } from "@/validationSchemas/CalculadoraSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, X } from "lucide-react";
import { useForm } from "react-hook-form";
import DialogItem from "../DialogItem";
import FormularioCalculadora from "../formularios/FormularioCalculadora";
import { useToast } from "../Toast";
import { Button } from "../ui/button";
import { DialogClose, DialogDescription, DialogTitle } from "../ui/dialog";
import { TypeParametroSchema } from "@/validationSchemas/ParametroSchema";


const ActualizarCalculadora = ({ calculadora, parametros }: { calculadora: TypeCalculadoraSchema, parametros: TypeParametroSchema[] }) => {
  const { addToast } = useToast();

  const onClick = () => {
    const formData = new FormData();
    formData.set('id', calculadora.id.toString());


    eliminarCalculadoraAction(formData);
    addToast(
      'La calculadora ha sido eliminada correctamente.',
      'success',
    );
  }

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
    async function actualizarCalculadora() {
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

      await actualizarCalculadoraAction(formData);
      addToast(
        'La calculadora ha sido actualizada correctamente.',
        'success',
      );
    }
    // actualizarCalculadora();
  }


  return (
    <DialogItem triggerChildren="Editar" className={'top-[50%] -bottom-[40%] overflow-y-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl px-20 py-12'}>
      <DialogTitle className="text-3xl font-semibold tracking-tight first:mt-0">Actualizar calculadora</DialogTitle>
      {/* <DialogDescription>
        Editar calculadora.
      </DialogDescription> */}
      <FormularioCalculadora form={form} onSubmit={onSubmit} parametros={parametros} />
      <div className="flex flex-row justify-between gap-4">
        <DialogClose asChild>
          <Button variant="default" className="w-full"><X />Cancelar</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button type="button" variant="warning" className="w-full" onClick={onClick}><Edit />Actualizar</Button>
        </DialogClose>
      </div>
    </DialogItem>
  )
}

export default ActualizarCalculadora;