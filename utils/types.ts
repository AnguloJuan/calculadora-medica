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

export type { Parametro };