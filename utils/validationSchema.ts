import { z } from "@/utils/es-zod";

const ParametroNumerico = z.object({
    id: z.number(),
    nombre: z.string().min(1),
    abreviatura: z.string().optional(),
    tipo_campo: z.enum(['numerico', 'seleccion', 'radio']),
    unidades: z.array(z.object({})).nonempty('Debe seleccionar al menos una unidad'),
    valorMaximo: z.coerce.number().optional(),
    valorMinimo: z.coerce.number().optional()
})

const ParametroSeleccion = z.object({
    id: z.number(),
    nombre: z.string().min(1),
    abreviatura: z.string().optional(),
    tipo_campo: z.enum(['numerico', 'seleccion', 'radio']),
    opciones: z.string().min(1)
})

export { ParametroNumerico, ParametroSeleccion };
