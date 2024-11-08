'use client'
import { IconPencil } from "@tabler/icons-react";
import { FunctionComponent, memo, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Parametro, Unidad, UnidadPorParametro } from "../utils/types";
import { Boton } from "./Botones";
import FormularioParametro from "./FormularioParametro";
import Modal from "./Modal";

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
    <Boton
      type="button"
      variante="warning"
      onClick={() => setAbierto(true)}
    >
      <IconPencil stroke={2} />
    </Boton>
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