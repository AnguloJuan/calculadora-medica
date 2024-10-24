import { z } from "@/utils/es-zod";
import { UnidadZ } from "./types";

const ParametroNumerico = z.object({
    id: z.number(),
    nombre: z.string().min(1),
    abreviatura: z.string().optional(),
    tipo_campo: z.enum(['numerico', 'seleccion', 'radio']),
    unidades: z.array(z.object({})).nonempty('Debe seleccionar al menos una unidad'),
    valorMaximo: z.number().optional(),
    valorMinimo: z.number().optional()
})

const ParametroSeleccion = z.object({
    id: z.number(),
    nombre: z.string().min(1),
    abreviatura: z.string().optional(),
    tipo_campo: z.enum(['numerico', 'seleccion', 'radio']),
    opciones: z.string().min(1)
})

export { ParametroNumerico, ParametroSeleccion };