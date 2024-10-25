'use client'
import { Parametro } from "@/utils/types";
import { memo, useState } from "react";
import BotonCrearParametro from "../components/BotonCrearParametro";
import ListaParametros from "../components/ListaParametros";
import SeleccionAgregarParametro from "./SeleccionAgregarParametro";

interface ParametrosProps {
    listaParametros: Parametro[];
}

function AgregarParametros({ listaParametros }: ParametrosProps) {
    const [parametros, setParametros] = useState<Parametro[]>([]);
    return (
        <>
            <fieldset className="w-full flex flex-col gap-2">
                <label htmlFor="parametros_existentes">Agregar parámetro</label>
                <div className="w-full grid grid-cols-2 gap-y-8 sm:grid-cols-6 gap-8">
                    <SeleccionAgregarParametro parametros={listaParametros} parametrosCalculadora={parametros} setParametrosCalculadora={setParametros} />
                    <BotonCrearParametro parametros={parametros} setParametros={setParametros} />
                </div>
            </fieldset>
            <ListaParametros parametros={parametros} setParametros={setParametros} sesion="admin" />
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

export default memo(AgregarParametros);