'use client'

import { Parametro } from "@/utils/types";
import React, { useEffect, useState } from "react";
import CampoParametro from "./CampoParametro";
import { Each } from "./EachOf";

interface ListaParametrosProps {
    parametros: Parametro[];
}

export default function ListaParametros({ parametros }: ListaParametrosProps) {
    return (
        <div className="flex flex-col w-full gap-10">
            <Each
                of={parametros}
                render={(parametro) => (
                    <CampoParametro key={parametro.id} parametro={parametro} />
                )}
            />
        </div>
    );
}