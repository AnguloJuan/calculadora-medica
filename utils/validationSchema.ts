import { z } from "@/utils/es-zod";
import { UnidadZ } from "./types";

const ParametroNumerico = z.object({
    id: z.number(),
    nombre: z.string().min(1),
    abreviatura: z.string().optional(),
    tipo_campo: z.enum(['numerico']),
    unidades: z.array(UnidadZ).nonempty('Debe tener al menos una unidad'),
    valorMaximo: z.number().optional(),
    valorMinimo: z.number().optional()
})

const ParametroSeleccion = z.object({
    id: z.number(),
    nombre: z.string().min(1),
    abreviatura: z.string().optional(),
    tipo_campo: z.enum(['seleccion', 'radio']),
    opciones: z.string().min(1)
})

export { ParametroNumerico, ParametroSeleccion };