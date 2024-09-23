interface InterfazParametro {
    id: number;
    nombre: string;
    tipo: 'numerico' | 'seleccion' | 'radio';
}

interface InterfazValor {
    id: number;
    valor: string;
}

export type { InterfazParametro, InterfazValor };