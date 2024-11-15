import { CATEGORIAS } from "@/utils/types";
import { z } from "../lib/es-zod";
import { ParametroSchema } from "./ParametroSchema";

const CalculadoraSchema = z.object({
  id: z.coerce.number(),
  nombre: z.string().min(2),
  descripcion: z.string().min(50),
  descripcion_corta: z.string().min(20).optional(),
  resultados_recomendaciones: z.string().min(50).optional(),
  categoria: z.enum(CATEGORIAS.map((categoria) => categoria.kebabCase) as [string, ...string[]]),
  formula: z.string().min(3),
  evidencias: z.array(z.string()),
  parametros: z.array(ParametroSchema).nonempty('Debe agregar al menos un parámetro'),
  enlace: z.string()
});

export default CalculadoraSchema;