'use client'
import { Parametro } from "@/utils/types";
import React from "react";
import { Each } from "../components/EachOf";

interface AgregarParametroProps {
    parametrosExistentes: Parametro[];
}
class AgregarParametro extends React.Component<AgregarParametroProps> {
    constructor(props: AgregarParametroProps) {
        super(props);
        // this.state = { : };
    }
    agregarParametro = () => {
        console.log('Agregando nuevo parametro');
    }

    render() {
        const { parametrosExistentes } = this.props;
        return (<>
            <select name="parametrosExistentes" id="parametrosExistentes" className="col-span-4">
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
        </>);
    }
}

export default AgregarParametro;