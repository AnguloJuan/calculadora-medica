'use client'
import { Unidad } from "@/utils/types";
import { IconPlus } from "@tabler/icons-react";
import { memo, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Boton } from "./Botones";
import FormularioUnidad from "./FormularioUnidad";
import Modal from "./Modal";

interface UnidadProps {
    setFieldValue?: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
    unidadesParametro?: Unidad[];
    setOpciones?: (opciones: { value: Unidad, label: string }[]) => void;
    shouldClose: boolean;
}

function BotonCrearUnidad({ setFieldValue, unidadesParametro, setOpciones, shouldClose }: UnidadProps) {
    const [abierto, setAbierto] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true)
    }, [])

    return (<>
        <div className="w-full col-span-2">
            <Boton variante="success" type="button" onClick={() => setAbierto(true)}>
                <IconPlus stroke={2} />
                Crear nueva unidad
            </Boton>
        </div>
        {isClient && createPortal(
            <Modal
                titulo={'Crear nuevo parámetro'}
                abierto={abierto}
                setAbierto={() => setAbierto(!abierto)}
            >
                <FormularioUnidad
                    setFieldValue={setFieldValue}
                    setAbierto={setAbierto}
                    setOpciones={setOpciones}
                    unidadesParametro={unidadesParametro}
                    shouldClose={shouldClose}
                />
            </Modal>,
            document.body
        )}
    </>)
}

export default memo(BotonCrearUnidad);