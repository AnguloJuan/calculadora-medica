'use client'
import { FunctionComponent, useState } from "react";
import { BotonAgregar } from "./Botones";
import Modal from "./Modal";

interface BotonAgregarParametroProps {
    children: React.ReactNode;
}

const BotonAgregarParametro: FunctionComponent<BotonAgregarParametroProps> = (BotonAgregarParametroProps) => {
    const { children } = BotonAgregarParametroProps;
    const [abierto, setAbierto] = useState(false);

    return (<>
        <div className="w-full col-span-2">
            <BotonAgregar funcion={() => setAbierto(true)}>Crear nuevo parámetro</BotonAgregar>
        </div>
        <Modal
            titulo={'Crear nuevo parámetro'}
            abierto={abierto}
            setAbierto={() => setAbierto(!abierto)}
            botonesAccion={[
                {
                    contenido: 'Crear',
                    funcion: () => console.log('Creando nuevo parametro'),
                    cerrarModal: true,
                },
                {
                    contenido: 'Cancelar',
                    funcion: () => console.log('Cancelando creacion de parametro'),
                    cerrarModal: true,
                    className: 'bg-red-600'
                }
            ]}
        >
            {children}
        </Modal>
    </>);
}

export default BotonAgregarParametro;