'use client'
import { Calculadora, Parametro } from "@/utils/types";
import React, { FunctionComponent, use, useEffect, useState } from "react";
import { Each } from "../components/EachOf";

interface AgregarParametroProps {
    parametros: Parametro[];
    // agregarParametro: (parametro: Parametro) => Promise<void>;
    parametrosCalculadora: Parametro[];
    setParametrosCalculadora: (parametros: Parametro[]) => void;
}

export default function AgregarParametro({ parametros, parametrosCalculadora, setParametrosCalculadora }: AgregarParametroProps) {

    const agregar = async (idParametro: number) => {
        if (idParametro === 0) {
            return;
        }
        // ver si parametro ya esta agregado 
        // if (parametrosCalculadora.find(parametro => parametro.id === idParametro)) {
        //     return
        // }
        const parametro = parametros.find(parametro => parametro.id === idParametro);
        // console.log(parametro, parametrosCalculadora);
        
        if (parametro) {
            setParametrosCalculadora([...parametrosCalculadora, parametro]);
        }
    }
    return (<>
        <select
            id="parametros_existentes"
            className="col-span-4"
            onChange={async (e) => agregar(parseInt(e.target.value))}
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