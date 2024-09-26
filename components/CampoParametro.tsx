'use client'

import { Parametro, Valor } from "@/utils/types";
import React from "react";
import { Each } from "./EachOf";

interface ParametroProps {
    parametro: Parametro;
    valores?: Valor[];
}

interface ParametroState {

}

class CampoParametro extends React.Component<ParametroProps, ParametroState> {
    constructor(props: ParametroProps) {
        super(props);
        //this.state = { :  };
    }
    render() {
        const { parametro, valores } = this.props;
        return (
            <>
                <div className="flex flex-col">
                    <label htmlFor={parametro.nombre}>{parametro.nombre}</label>
                    {parametro.tipo === 'numerico' && (
                        <input type="number" name={parametro.nombre} id={parametro.nombre} />
                    )}

                    {parametro.tipo === 'seleccion' && (
                        <select name="parametros" id="parametros">
                            <option value="0">Seleccione un parámetro</option>
                            {valores &&
                                <Each
                                    of={valores}
                                    render={(valor) => (
                                        <option key={valor.id} value={valor.id}>
                                            {valor.valor}
                                        </option>
                                    )}
                                />
                            }

                        </select>
                    )}

                    {parametro.tipo === 'radio' && (
                        <div className="flex flex-row">
                            {valores &&
                                <Each
                                    of={valores}
                                    render={(valor) => (
                                        <div key={valor.id}>
                                            <input type="radio" name={parametro.nombre} id={valor.valor} value={valor.id} />
                                            <label htmlFor={valor.valor}>{valor.valor}</label>
                                        </div>
                                    )}
                                />
                            }
                        </div>
                    )}
                </div>
            </>
        );
    }
}

export default CampoParametro;