'use client'

import { Parametro } from "@/utils/types";
import React from "react";
import { Each } from "./EachOf";
import CampoParametro from "./CampoParametro";

interface ListaParametrosProps {
    parametros: Parametro[];
}

interface ListaParametrosState {
    open: boolean;
}

/**
 * Constante de testeo sera eliminado en la version final
 */
const valores = [
    { id: 1, valor: 'Valor 1' },
    { id: 2, valor: 'Valor 2' },
    { id: 3, valor: 'Valor 3' },
    { id: 4, valor: 'Valor 4' },
    { id: 5, valor: 'Valor 5' },
];

class ListaParametros extends React.Component<ListaParametrosProps, ListaParametrosState> {
    constructor(props: ListaParametrosProps) {
        super(props);
        this.state = { open: false }
    }
    render() {
        const { parametros: parametrosExistentes } = this.props;
        return (
            <div className="flex flex-col w-full gap-6">
                <Each
                    of={parametrosExistentes}
                    render={(parametro) => (
                        <CampoParametro key={parametro.id} parametro={parametro} valores={valores} />
                    )}
                />
            </div>
        );
    }
}

export default ListaParametros;