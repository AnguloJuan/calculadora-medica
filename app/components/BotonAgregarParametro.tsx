'use client'
import { crearParametroAction } from "@/utils/actions";
import { Parametro } from "@/utils/types";
import { IconX } from "@tabler/icons-react";
import { FunctionComponent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BotonAgregar } from "./Botones";
import FormularioCrearParametro from "./FormularioCrearParametro";
import Modal from "./Modal";
import { useToast } from "./Toast";

interface BotonAgregarParametroProps {
    datosCalculadora: { nombre: string; descripcion: string; parametros: Parametro[]; formula: string; };
}

const BotonAgregarParametro: FunctionComponent<BotonAgregarParametroProps> = (BotonAgregarParametroProps) => {
    const [abierto, setAbierto] = useState(false);
    const datosParametro = new FormData();
    const { addToast } = useToast();
    const { datosCalculadora } = BotonAgregarParametroProps;
    const [isClient, setIsClient] = useState(false);
    datosParametro.set('tipo_campo', 'numerico');

    useEffect(() => {
        setIsClient(true)
    }, [])

    const crearParametro = async () => {
        // Validaciones de los campos del formulario
        if (!datosParametro.get('nombre') || !datosParametro.get('tipo_campo')
            || (datosParametro.get('tipo_campo') === 'numerico' && !datosParametro.get('unidad_metrica'))
        ) {
            addToast('Por favor llene todos los campos obligatorios', 'error')
            return;
        }

        if (datosParametro.get('tipo_campo') === 'numerico' &&
            ((datosParametro.get('valorMinimo') && datosParametro.get('valorMaximo')) &&
                (parseInt(datosParametro.get('valorMinimo') as string) < parseInt(datosParametro.get('valorMaximo') as string))
            )
        ) {
            addToast('Valor máximo no puede ser menor al minimo', 'error')
            return;
        }

        if (datosParametro.get('tipo_campo') === 'seleccion' && !datosParametro.get('opciones')) {
            addToast('Por favor ingrese al menos dos opciones', 'error')
            return;
        }

        try {
            const respuesta = await crearParametroAction(datosParametro);
            if (respuesta.id) {
                datosCalculadora.parametros.push(
                    {
                        id: respuesta.id,
                        nombre: datosParametro.get('nombre') as string,
                        tipo_campo: datosParametro.get('tipo_campo') as "numerico" | "seleccion" | "radio",
                        abreviatura: datosParametro.get('abreviatura') as string,
                        unidad_metrica: datosParametro.get('unidad_metrica') as string,
                        valorMinimo: parseInt(datosParametro.get('valorMinimo') as string),
                        valorMaximo: parseInt(datosParametro.get('valorMaximo') as string),
                        opciones: datosParametro.get('opciones') as string,
                    }
                );
                addToast(respuesta.message || 'Parámetro guardado con éxito', 'success');
                setAbierto(false);
            } else {                
                addToast('Ocurrió un error inesperado en el servidor', 'error');
            }
        } catch (err) {
            addToast('Ocurrió un error inesperado', 'error');
        }
    }

    return (<>
        <div className="w-full col-span-2">
            <BotonAgregar funcion={() => setAbierto(true)}>Crear nuevo parámetro</BotonAgregar>
        </div>
        {isClient && createPortal(
            <form action={crearParametroAction}>
                <Modal
                    titulo={'Crear nuevo parámetro'}
                    abierto={abierto}
                    setAbierto={() => setAbierto(!abierto)}
                    botonesAccion={<>
                        <button
                            onClick={() => setAbierto(false)}
                            className="w-full inline-flex items-center justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto"
                        >
                            <IconX stroke={2} />
                            Cancelar
                        </button>
                        <BotonAgregar funcion={crearParametro}>
                            Guardar
                        </BotonAgregar>
                    </>}
                >
                    <FormularioCrearParametro datosFormulario={datosParametro} />
                </Modal>
            </form>,
            document.body
        )}
    </>);
}

export default BotonAgregarParametro;