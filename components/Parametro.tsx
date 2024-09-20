'use client'

import { TipoParametro } from "@/utils/types";
import React from "react";
import { Each } from "./EachOf";

interface ParametroProps {
    parametro: TipoParametro;
}
 
interface ParametroState {
    
}
 
class Parametro extends React.Component<ParametroProps, ParametroState> {
    constructor(props: ParametroProps) {
        super(props);
        //this.state = { :  };
    }
    render() {
        const { parametro } = this.props;
        return ( 
            <>
                <div className="flex flex-col">
                    {parametro.tipo === 'numerico' ?? (
                        <input type="number" name={parametro.nombre} id={parametro.nombre} />
                    ) : parametro.tipo === 'seleccion' ?? (
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
                        ) 
                        : parametro.tipo === 'radio' && (
                            <input type="radio" name={parametro.nombre} id={parametro.nombre} />
                        )}
                </div>
            </>
         );
    }
}
 
export default Parametro;