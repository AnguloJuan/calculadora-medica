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
  tipo_campo: z.literal('seleccion'),
  opciones: z.string().min(1)
})
const ParametroRadioSchema = z.object({
  id: z.number(),
  nombre: z.string().min(1),
  abreviatura: z.string().optional(),
  tipo_campo: z.literal('radio'),
  opciones: z.string().min(1)
})

// const ParametroSchema = z.union([ParametroNumericoSchema, ParametroSeleccionSchema, ParametroRadioSchema]);
const ParametroSchema = z.object({
  id: z.number(),
  nombre: z.string().min(1),
  abreviatura: z.string().optional(),
  tipo_campo: z.enum(['numerico', 'seleccion', 'radio']),
  unidades: z.array(z.any()).optional(),
  valorMaximo: z.coerce.number().optional(),
  valorMinimo: z.coerce.number().optional(),
  opciones: z.string().optional()
});

type TypeParametroSchema = z.infer<typeof ParametroSchema>;

export { ParametroSchema };
export type { TypeParametroSchema };

