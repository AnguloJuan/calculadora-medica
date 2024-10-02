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

class ListaParametros extends React.Component<ListaParametrosProps, ListaParametrosState> {
    constructor(props: ListaParametrosProps) {
        super(props);
        this.state = { open: false }
    }
    render() {
        const { parametros: parametrosExistentes } = this.props;
        return (
            <div className="flex flex-col w-full gap-10">
                <Each
                    of={parametrosExistentes}
                    render={(parametro) => (
                        <CampoParametro key={parametro.id} parametro={parametro} />
                    )}
                />
            </div>
        );
    }
}

export default ListaParametros;