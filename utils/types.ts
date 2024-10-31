import { z } from "./es-zod";

var kebabCase = require('lodash/kebabCase');

const CATEGORIA_OPTIONS = ['Química sanguínea', 'Hematología', 'Perfil de lípidos', 'Proteínas', 'Otros'];
// convert de options of CATEGORIA_OPTIONS to an array of strings in kebabcase
const CATEGORIA = z.enum(CATEGORIA_OPTIONS.map((categoria) => kebabCase(categoria)) as [string, ...string[]]);
// const CATEGORIA = z.enum(['Química sanguínea', 'Hematología', 'Perfil de lípidos', 'Proteínas', 'Otros']);

interface Calculadora {
    id: number,
    nombre: string,
    descripcion: string,
    descripcion_corta: string,
    resultados_recomendaciones: string,
    categoria: z.infer<typeof CATEGORIA>,
    formula: string,
    enlace: string
}

interface Parametro {
    id: number;
    nombre: string;
    abreviatura?: string;
    tipo_campo: 'numerico' | 'seleccion' | 'radio';
    valorMaximo?: number;
    valorMinimo?: number;
    opciones?: string;
    unidadActual?: Unidad;
}

interface Evidencia {
    id: number,
    cita: string,
    id_calculadora: number
}

interface Unidad {
    id: number,
    unidad: string,
    conversion?: number,
    id_unidad_conversion?: number
}

interface UnidadPorParametro {
    id_parametro: number;
    unidades: Unidad[];
};

const CalculadoraZ = z.object({
    id: z.coerce.number(),
    nombre: z.string().min(1),
    descripcion: z.string().min(1),
    descripcion_corta: z.string().min(1),
    resultados_recomendaciones: z.string().min(1),
    categoria: CATEGORIA,
    formula: z.string().min(1),
    enlace: z.string()
}) satisfies z.ZodType<Calculadora>;

const EvidenciaZ = z.object({
    id: z.number(),
    cita: z.string().min(1),
    id_calculadora: z.number()
}) satisfies z.ZodType<Evidencia>;

const UnidadZ = z.object({
    id: z.number(),
    unidad: z.string().min(1).max(10),
    conversion: z.number().optional(),
    id_unidad_conversion: z.number().optional()
}) satisfies z.ZodType<Unidad>;

const ParametroZ = z.object({
    id: z.number(),
    nombre: z.string().min(1),
    abreviatura: z.string(),
    tipo_campo: z.enum(['numerico', 'seleccion', 'radio']),
    valorMaximo: z.number().optional(),
    valorMinimo: z.number().optional(),
    opciones: z.string().min(1).optional(),
    unidadActual: UnidadZ.optional()
}) satisfies z.ZodType<Parametro>;

export { CalculadoraZ, EvidenciaZ, ParametroZ, UnidadZ, CATEGORIA, CATEGORIA_OPTIONS };
export type { Calculadora, Evidencia, Parametro, Unidad, UnidadPorParametro };