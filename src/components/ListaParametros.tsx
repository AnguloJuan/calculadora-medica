'use client'

import { z } from "@/lib/es-zod";
import { ParametroSchema } from "@/validationSchemas/ParametroSchema";
import { IconTrash } from "@tabler/icons-react";
import { memo, useEffect, useState } from "react";
import { obtenerUnidadesPorParametroAction } from "../utils/actions";
import { UnidadPorParametro } from "../utils/types";
import BotonActualizarParametro from "./BotonActualizarParametro";
import { Boton } from "./Botones";
import CampoParametro from "./CampoParametro";
import { Each } from "./EachOf";

interface ListaParametrosProps {
  parametros: z.infer<typeof ParametroSchema>[];
  sesion: string;
}

function ListaParametros({ parametros, sesion }: ListaParametrosProps) {

  const BotonEliminar = ({ id }: { id: number }) => {
    const EliminarParametro = () => {
      const nuevosParametros = parametros.filter((parametro) => parametro.id !== id);
    }
    return (
      <Boton
        type="button"
        variante="danger"
        onClick={EliminarParametro}
      >
        <IconTrash stroke={2} />
      </Boton>
    );
  }

  return (
    <div className="flex flex-col w-full gap-10">
      <Each
        of={parametros}
        render={(parametro) => {
          return (<div className="flex flex-row gap-2">
            <CampoParametro key={parametro.id} parametro={parametro} />
            {sesion === 'admin' && (
              <div className="flex flex-row gap-1">
                <BotonEliminar id={parametro.id} />
                <BotonActualizarParametro
                  parametro={parametro}
                />
              </div>
            )}
          </div>)
        }}
      />
    </div>
  );
}

export default memo(ListaParametros);