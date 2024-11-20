import { Parametro } from "@/utils/types";
import { z } from "../lib/es-zod";
import UnidadSchema from "./UnidadSchema";

const ParametroSchema = z.object({
  id: z.number(),
  nombre: z.string().min(1),
  abreviatura: z.string().optional(),
  tipo_campo: z.enum(['numerico', 'seleccion', 'radio']),
  valorMaximo: z.coerce.number().optional(),
  valorMinimo: z.coerce.number().optional(),
  opciones: z.string().min(1).optional(),
  unidades: z.array(UnidadSchema).nonempty('Debe seleccionar al menos una unidad').optional(),
  requerido: z.boolean().optional()
}) satisfies z.ZodType<Parametro>;

const ParametroNumericoSchema = z.object({
  id: z.number(),
  nombre: z.string().min(1),
  abreviatura: z.string().optional(),
  tipo_campo: z.enum(['numerico', 'seleccion', 'radio']),
  unidades: z.array(z.object({})).nonempty('Debe seleccionar al menos una unidad'),
  valorMaximo: z.coerce.number().optional(),
  valorMinimo: z.coerce.number().optional()
})

const ParametroSeleccionSchema = z.object({
  id: z.number(),
  nombre: z.string().min(1),
  abreviatura: z.string().optional(),
  tipo_campo: z.enum(['numerico', 'seleccion', 'radio']),
  opciones: z.string().min(1)
})

export { ParametroNumericoSchema, ParametroSchema, ParametroSeleccionSchema };

