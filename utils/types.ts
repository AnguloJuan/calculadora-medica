interface Parametro {
    id: number;
    nombre: string;
    tipo: 'numerico' | 'seleccion' | 'radio';
}

interface Valor {
    id: number;
    valor: string;
    // idParametro: number;
}

export type { Parametro, Valor };