
// var kebabCase = require('lodash/kebabCase');

// const CATEGORIA_OPTIONS = ['Química sanguínea', 'Hematología', 'Perfil de lípidos', 'Proteínas', 'Otros'];
// convert de options of CATEGORIA_OPTIONS to an array of strings in kebabcase
// const CATEGORIA = z.enum(CATEGORIA_OPTIONS.map((categoria) => kebabCase(categoria)) as [string, ...string[]]);
// const CATEGORIA = z.enum(['Química sanguínea', 'Hematología', 'Perfil de lípidos', 'Proteínas', 'Otros']);
const CATEGORIAS = [
  {
    nombre: 'Química sanguínea',
    kebabCase: 'quimica-sanguinea'
  },
  {
    nombre: 'Hematología',
    kebabCase: 'hematologia'
  },
  {
    nombre: 'Perfil de lípidos',
    kebabCase: 'perfil-de-lipidos'
  },
  {
    nombre: 'Proteínas',
    kebabCase: 'proteinas'
  },
  {
    nombre: 'Otros',
    kebabCase: 'otros'
  }
]

interface Calculadora {
  id: number,
  nombre: string,
  descripcion: string,
  descripcion_corta: string,
  resultados_recomendaciones: string,
  categoria: typeof CATEGORIAS[number]['kebabCase'],
  formula: string,
  formula_display: string,
  unidad_resultado: string,
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
  enlace: string,
  id_calculadora: number
}

interface Unidad {
  id: number,
  unidad: string,
  conversion?: string | null,
  id_unidad_conversion?: number | null
}

interface UnidadPorParametro {
  id_parametro: number;
  unidades: Unidad[];
};

export { CATEGORIAS };
export type { Calculadora, Evidencia, Parametro, Unidad, UnidadPorParametro };
