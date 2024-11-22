'use client'
import { IconPencil } from "@tabler/icons-react";
import { FunctionComponent, memo, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Parametro, Unidad, UnidadPorParametro } from "../utils/types";
import FormularioParametro from "./FormularioParametroBackup";
import Modal from "./Modal";
import { Button } from "./ui/button";

type BotonEditarParametroProps = {
  parametro: Parametro;
  unidadesParametro?: Unidad[];
  parametros?: Parametro[];
  setParametros?: (parametros: Parametro[]) => void;
  setUnidadesPorParametro?: (unidadesPorParametro: UnidadPorParametro[]) => void;
}

const BotonActualizarParametro: FunctionComponent<BotonEditarParametroProps> = (
  { parametro, unidadesParametro, parametros, setParametros, setUnidadesPorParametro }: BotonEditarParametroProps
) => {
  const [abierto, setAbierto] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (<>
    <Button
      type="button"
      variant={'warning'}
      onClick={() => setAbierto(true)}
    >
      <IconPencil stroke={2} />
    </Button>
    {isClient && createPortal(
      <Modal
        titulo={'Crear nuevo parámetro'}
        abierto={abierto}
        setAbierto={() => setAbierto(!abierto)}
      >
        <FormularioParametro
          parametros={parametros}
          setParametros={setParametros}
          setAbierto={setAbierto}
          accion="actualizar"
          parametro={parametro}
          unidadesParametro={unidadesParametro}
          setUnidadesPorParametro={setUnidadesPorParametro}
        />
      </Modal>,
      document.body
    )}
  </>);
}

export default memo(BotonActualizarParametro);