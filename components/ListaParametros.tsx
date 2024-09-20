'use client'

import { TipoParametro } from "@/utils/types";
import React from "react";
import { Each } from "./EachOf";

interface ListaParametrosProps {
    parametro: TipoParametro;
    parametrosExistentes: TipoParametro[];
}

interface ListaParametrosState {
    open: boolean;
}

class ListaParametros extends React.Component<ListaParametrosProps, ListaParametrosState> {
    state = { open: false }
    render() {
        return (
            <div className="flex flex-col">
                <select name="parametros" id="parametros">
                    <option value="0">Seleccione un parámetro</option>
                    <Each
                        of={parametrosExistentes}
                        render={(parametro) => (
                            <option key={parametro.id} value={parametro.id}>
                                {parametro.nombre}
                            </option>
                        )}
                    />
                </select>
            </div>
        );
    }
}

export default parametro;