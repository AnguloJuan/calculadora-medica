'use client'
import { Calculadora, Parametro } from "@/utils/types";
import React, { FunctionComponent, use, useEffect, useState } from "react";
import { Each } from "../components/EachOf";

interface AgregarParametroProps {
    parametros: Parametro[];
    datosCalculadora: Parametro[];
}

export default function AgregarParametro({ parametros, datosCalculadora }: AgregarParametroProps) {
    const [idParametro, setIdParametro] = useState(0);

    useEffect(() => {
        function AgregarParametro() {
            if (idParametro === 0) {
                return;
            }
            const parametro = parametros.find(parametro => parametro.id === idParametro);
            if (parametro) {
                datosCalculadora.push(parametro);
            }
        }
    }, [idParametro, parametros, datosCalculadora]);

    return (<>
        <select
            name="parametrosExistentes"
            id="parametrosExistentes"
            className="col-span-4"
            value={idParametro}
            onChange={(e) => setIdParametro(parseInt(e.currentTarget.value))}
        >
            <option value="0">Seleccione un parámetro</option>
            {parametros.length !== 0 &&
                <Each
                    of={parametros}
                    render={(parametro) => (
                        <option key={parametro.id} value={parametro.id}>
                            {parametro.nombre}
                        </option>
                    )}
                />
            }
        </select>
    </>);
}