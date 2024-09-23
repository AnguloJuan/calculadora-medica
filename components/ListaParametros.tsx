'use client'

import { InterfazParametro } from "@/utils/types";
import React from "react";
import { Each } from "./EachOf";
import Parametro from "./Parametro";

interface ListaParametrosProps {
    parametro: InterfazParametro;
    parametrosExistentes: InterfazParametro[];
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
                            Parametro key={parametro.id}   />
                        )}
                    />
                </select>
            </div>
        );
    }
}

export default parametro;