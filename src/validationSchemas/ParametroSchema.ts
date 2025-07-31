import { z } from "../lib/es-zod";
import UnidadSchema from "./UnidadSchema";

const ParametroNumericoSchema = z.object({
  id: z.number(),
  nombre: z.string().min(1),
  abreviatura: z.string().optional(),
  tipo_campo: z.literal('numerico'),
  unidades: z.array(UnidadSchema),
  valorMaximo: z.coerce.number().optional(),
  valorMinimo: z.coerce.number().optional()
})

const ParametroSeleccionSchema = z.object({
  id: z.number(),
  nombre: z.string().min(1),
  abreviatura: z.string().optional(),
  tipo_campo: z.enum(['seleccion', 'radio']),
  opciones: z.string().min(1)
})

const ParametroSchema = z.discriminatedUnion("tipo_campo", [ParametroNumericoSchema, ParametroSeleccionSchema]);

type TypeParametroSchema = z.infer<typeof ParametroSchema>;

export { ParametroSchema };
export type { TypeParametroSchema };

