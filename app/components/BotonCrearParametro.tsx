'use client'

import { crearParametroAction } from "@/utils/actions";
import { Parametro } from "@/utils/types";
import { IconPlus } from "@tabler/icons-react";
import { FunctionComponent, memo, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Boton } from "./Botones";
import FormularioParametro from "./FormularioParametro";
import Modal from "./Modal";
import { useToast } from "./Toast";

interface BotonAgregarParametroProps {
    parametros?: Parametro[];
    setParametros?: (parametros: Parametro[]) => void;
}

const BotonCrearParametro: FunctionComponent<BotonAgregarParametroProps> = ({ parametros, setParametros }: BotonAgregarParametroProps) => {
    const [abierto, setAbierto] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true)
    }, [])

    return (<>
        <div className="w-full col-span-2">
            <Boton variante="success" type="button" onClick={() => setAbierto(true)}>
                <IconPlus stroke={2} />
                Crear nuevo parámetro
            </Boton>
        </div>
        {isClient && createPortal(
            <Modal
                titulo={'Crear nuevo parámetro'}
                abierto={abierto}
                setAbierto={() => setAbierto(!abierto)}
            >
                <FormularioParametro parametros={parametros} setParametros={setParametros} setAbierto={setAbierto} accion="guardar" />
            </Modal>,
            document.body
        )}
    </>);
}

export default memo(BotonCrearParametro);