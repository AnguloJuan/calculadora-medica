'use client'
import { Parametro } from "@/utils/types";
import BotonAgregarParametro from "../components/BotonAgregarParametro";
import ListaParametros from "../components/ListaParametros";
import AgregarParametro from "./AgregarParametro";
import { useState } from "react";

interface ParametrosProps {
    parametros: Parametro[];
    listaParametros: Parametro[];
}

export default function Parametros({ parametros, listaParametros }: ParametrosProps) {
    const [parametrosCalculadora, setParametrosCalculadora] = useState<Parametro[]>(parametros);
    return (
        <>
            <div className="w-full flex flex-col gap-2">
                <span>Agregar parámetro</span>
                <div className="w-full grid grid-cols-2 gap-y-8 sm:grid-cols-6 gap-8">
                    {Array.isArray(listaParametros) ? (
                        <AgregarParametro parametros={listaParametros} parametrosCalculadora={parametros} setParametrosCalculadora={setParametrosCalculadora} />
                    ) : (
                        <div>Error de servidor</div>
                    )}
                    <BotonAgregarParametro parametros={parametrosCalculadora} />
                </div>
            </div>
            <ListaParametros parametros={parametrosCalculadora} />
        </>
    )
}