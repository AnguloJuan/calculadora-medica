import { CATEGORIAS } from "@/utils/types";
import { z } from "../lib/es-zod";
import EvidenciaSchema from "./EvidenciaSchema";
import { ParametroSchema } from "./ParametroSchema";

const CalculadoraSchema = z.object({
  id: z.coerce.number(),
  nombre: z.string().min(2),
  descripcion: z.string().min(500),
  descripcion_corta: z.string().min(20).optional(),
  resultados_recomendaciones: z.string().min(50).optional(),
  categoria: z.enum(CATEGORIAS.map((categoria) => categoria.kebabCase) as [string, ...string[]]),
  formula: z.string().min(3),
  parametros: z.array(z.any()).nonempty('Debe agregar al menos un parámetro'),
  enlace: z.string().optional(),
  evidencias: z.array(EvidenciaSchema).nonempty('Debe agregar al menos una evidencia'),
});
type TypeCalculadoraSchema = z.infer<typeof CalculadoraSchema>;

export default CalculadoraSchema;
export type { TypeCalculadoraSchema };