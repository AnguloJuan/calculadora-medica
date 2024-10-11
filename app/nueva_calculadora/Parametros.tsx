'use client'
import { Parametro } from "@/utils/types";
import BotonAgregarParametro from "../components/BotonAgregarParametro";
import ListaParametros from "../components/ListaParametros";
import AgregarParametro from "./AgregarParametro";
import { useState } from "react";

interface ParametrosProps {
    listaParametros: Parametro[];
}

export default function Parametros({ listaParametros }: ParametrosProps) {
    const [parametros, setParametros] = useState<Parametro[]>([]);
    return (
        <>
            <div className="w-full flex flex-col gap-2">
                <span>Agregar parámetro</span>
                <div className="w-full grid grid-cols-2 gap-y-8 sm:grid-cols-6 gap-8">
                    <AgregarParametro parametros={listaParametros} parametrosCalculadora={parametros} setParametrosCalculadora={setParametros} />
                    <BotonAgregarParametro parametros={parametros} setParametros={setParametros} />
                </div>
            </div>
            <ListaParametros parametros={parametros} />
            <input
                id="parametros"
                name="parametros"
                type="text"
                value={JSON.stringify(parametros)}
                readOnly
                aria-readonly
                className="opacity-0 hidden size-0"
            />
        </>
    )
}