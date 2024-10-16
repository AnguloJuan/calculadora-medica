import { z } from "zod";

const AREA = z.enum(['Química sanguínea', 'Hematología', 'Perfil de lípidos', 'Proteínas', 'Otros']);

interface Calculadora {
    id: number,
    nombre: string,
    descripcion: string,
    descripcion_corta: string,
    resultados_recomendaciones: string,
    area: z.infer<typeof AREA>,
    formula: string,
    enlace: string
}

interface Parametro {
    id: number;
    nombre: string;
    abreviatura: string;
    tipo_campo: 'numerico' | 'seleccion' | 'radio';
    unidad_metrica?: string;
    valorMaximo?: number;
    valorMinimo?: number;
    opciones?: string;
}

interface Evidencia {
    id: number,
    cita: string,
    id_calculadora: number
}

const ParametroZ = z.object({
    id: z.number(),
    nombre: z.string().min(1),
    abreviatura: z.string(),
    tipo_campo: z.enum(['numerico', 'seleccion', 'radio']),
    unidad_metrica: z.string().optional(),
    valorMaximo: z.number().optional(),
    valorMinimo: z.number().optional(),
    opciones: z.string().optional()
}) satisfies z.ZodType<Parametro>;

const EvidenciaZ = z.object({
    id: z.number(),
    cita: z.string().min(1),
    id_calculadora: z.number()
}) satisfies z.ZodType<Evidencia>;

const CalculadoraZ = z.object({
    id: z.coerce.number(),
    nombre: z.string().min(1),
    descripcion: z.string().min(1),
    descripcion_corta: z.string().min(1),
    resultados_recomendaciones: z.string().min(1),
    area: AREA,
    formula: z.string().min(1),
    enlace: z.string()
}) satisfies z.ZodType<Calculadora>;

export { CalculadoraZ, EvidenciaZ, ParametroZ, AREA };
export type { Calculadora, Evidencia, Parametro };