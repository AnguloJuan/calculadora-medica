'use client'

import { TypeParametroSchema } from "@/validationSchemas/ParametroSchema";
import { IconTrash } from "@tabler/icons-react";
import { memo } from "react";
import CampoParametro from "./CampoParametro";
import { Each } from "./EachOf";
import { Button } from "./ui/button";

interface ListaParametrosProps {
  parametros: TypeParametroSchema[];
  setParametros?: (parametros: TypeParametroSchema[]) => void;
  onChange?: (parametro: string, valor: number) => void;
}

function ListaParametros({ parametros, onChange }: ListaParametrosProps) {
  return (
    <div className="flex flex-col w-full gap-10">
      <Each
        of={parametros}
        render={(parametro) => {
          return (<CampoParametro key={parametro.id} parametro={parametro} onChange={onChange} />)
        }}
      />
    </div>
  );
}

export default memo(ListaParametros);