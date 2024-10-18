'use client'
import { Unidad } from "@/utils/types";
import { IconPlus, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Boton } from "./Botones";
import Modal from "./Modal";
import FormularioUnidad from "./FormularioUnidad";

export default function AgregarUnidad() {
    const [abierto, setAbierto] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [unidad, setUnidad] = useState<Unidad>({
        id: 0,
        unidad: '',
        conversion: undefined,
        id_unidad_conversion: undefined
    });

    useEffect(() => {
        setIsClient(true)
    }, [])

    const crearUnidad = () => {
        // Crear unidad
    }

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
                botonesAccion={<>
                    <Boton
                        type="button"
                        tipo="danger"
                        onClick={() => setAbierto(false)}
                    >
                        <IconX stroke={2} />
                        Cancelar
                    </Boton>
                    <Boton type="button" tipo="success" onClick={crearUnidad}>
                        <IconPlus stroke={2} />
                        Guardar
                    </Boton>
                </>}
            >
                <FormularioUnidad unidad={unidad} setUnidad={setUnidad} />
            </Modal>,
            document.body
        )}
    </>)
}