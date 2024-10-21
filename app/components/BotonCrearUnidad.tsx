'use client'
import { Unidad } from "@/utils/types";
import { IconPlus, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Boton } from "./Botones";
import Modal from "./Modal";
import FormularioUnidad from "./FormularioUnidad";

interface UnidadProps {
    unidades?: Unidad[];
    setUnidades?: (unidades: Unidad[]) => void;
    fetchUnidades: boolean;
    setFetchUnidades: (fetchUnidades: boolean) => void;
}

export default function BotonCrearUnidad({ unidades, setUnidades, fetchUnidades, setFetchUnidades }: UnidadProps) {
    const [abierto, setAbierto] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true)
    }, [])

    return (<>
        <div className="w-full col-span-2">
            <Boton tipo="success" type="button" onClick={() => setAbierto(true)}>
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
                <FormularioUnidad unidadesParametro={unidades} setUnidadesParametro={setUnidades} setAbierto={setAbierto} fetchUnidades={fetchUnidades} setFetchUnidades={setFetchUnidades} />
            </Modal>,
            document.body
        )}
    </>)
}