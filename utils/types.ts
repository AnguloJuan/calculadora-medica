/**
 * Tipos de datos utilizados en la aplicación
 * @module utils/types
 * 
 * @typedef {Object} Parametro
 * @property {number} id - Identificador del parámetro
 * @property {string} nombre - Nombre del parámetro
 * @property {string} abreviatura - Abreviatura del parámetro para la formula
 * @property {'numerico' | 'seleccion' | 'radio'} tipo_campo - Tipo de campo del parámetro
 * @property {string} [unidad_metrica] - Unidad de medida del parámetro para parámetros tipo numerico
 * @property {number} [valorMaximo] - Valor máximo del parámetro para parámetros tipo numerico
 * @property {number} [valorMinimo] - Valor mínimo del parámetro para parámetros tipo numerico
 * @property {string} [opciones] - Valores posibles del parámetro para parámetros tipo seleccion y radio
 */

import { z } from "zod";

interface Calculadora {
    id: number,
    nombre: string,
    descripcion: string,
    descripcion_corta: string,
    resultados_recomendaciones: string,
    parametros: Parametro[],
    formula: string,
    evidencias: Evidencia[]
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
    cita: z.string()
}) satisfies z.ZodType<Evidencia>;

const CalculadoraZ = z.object({
    id: z.coerce.number(),
    nombre: z.string().min(1),
    descripcion: z.string().min(1),
    descripcion_corta: z.string().min(1),
    resultados_recomendaciones: z.string().min(1),
    parametros: z.array(ParametroZ).nonempty(),
    formula: z.string().min(1),
    evidencias: z.array(EvidenciaZ).nonempty()
}) satisfies z.ZodType<Calculadora>;

export { CalculadoraZ, EvidenciaZ, ParametroZ };
export type { Calculadora, Evidencia, Parametro };
