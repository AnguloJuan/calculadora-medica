interface TipoParametro {
    id: number;
    nombre: string;
    tipo: 'numerico' | 'seleccion' | 'radio';   
}

export type { TipoParametro };