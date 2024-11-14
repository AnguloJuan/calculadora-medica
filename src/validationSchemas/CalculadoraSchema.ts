import { CATEGORIAS } from "@/utils/types";
import { z } from "../lib/es-zod";
import { ParametroSchema } from "./ParametroSchema";

const CalculadoraSchema = z.object({
  id: z.coerce.number(),
  nombre: z.string().min(1),
  descripcion: z.string().min(1),
  descripcion_corta: z.string().min(1),
  resultados_recomendaciones: z.string().min(1),
  categoria: z.enum(CATEGORIAS.map((categoria) => categoria.kebabCase) as [string, ...string[]]),
  formula: z.string().min(1),
  evidencias: z.array(z.string()),
  parametros: z.array(ParametroSchema),
  enlace: z.string()
});

export default CalculadoraSchema;