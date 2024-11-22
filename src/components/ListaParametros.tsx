'use client'

import { TypeParametroSchema } from "@/validationSchemas/ParametroSchema";
import { IconTrash } from "@tabler/icons-react";
import { memo } from "react";
import BotonActualizarParametro from "./BotonActualizarParametro";
import CampoParametro from "./CampoParametro";
import { Each } from "./EachOf";
import { Button } from "./ui/button";

interface ListaParametrosProps {
  parametros: TypeParametroSchema[];
  setParametros?: (parametros: TypeParametroSchema[]) => void;
  sesion: string;
  onChange?: (parametro: string, valor: number) => void;
}

function ListaParametros({ parametros, sesion, onChange }: ListaParametrosProps) {

  const BotonEliminar = ({ id }: { id: number }) => {
    const EliminarParametro = () => {
      const nuevosParametros = parametros.filter((parametro) => parametro.id !== id);
    }
    return (
      <Button
        type="button"
        variant={'destructive'}
        onClick={EliminarParametro}
      >
        <IconTrash stroke={2} />
      </Button>
    );
  }

  return (
    <div className="flex flex-col w-full gap-10">
      <Each
        of={parametros}
        render={(parametro) => {
          return (<div className="flex flex-row gap-2">
            <CampoParametro key={parametro.id} parametro={parametro} onChange={onChange} />
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