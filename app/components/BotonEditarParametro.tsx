'use client'
import { editarParametroAction } from "@/utils/actions";
import { Parametro } from "@/utils/types";
import { IconPencil, IconX } from "@tabler/icons-react";
import { FunctionComponent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Boton } from "./Botones";
import FormularioParametro from "./FormularioParametro";
import Modal from "./Modal";
import { useToast } from "./Toast";

type BotonEditarParametroProps = {
    parametro: Parametro;
    parametros?: Parametro[];
    setParametros?: (parametros: Parametro[]) => void;
}

const BotonEditarParametro: FunctionComponent<BotonEditarParametroProps> = ({ parametro: datosParametro, parametros, setParametros }: BotonEditarParametroProps) => {
    const [abierto, setAbierto] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const { addToast } = useToast();
    const [parametro, setParametro] = useState<Parametro>(datosParametro);

    useEffect(() => {
        setIsClient(true)
    }, [])

    const validarDatos = () => {
        // Validaciones de los campos del formulario
        if (!parametro.nombre || !parametro.tipo_campo
            || (parametro.tipo_campo === 'numerico' && !parametro.unidad_metrica)
        ) {
            addToast('Por favor llene todos los campos obligatorios', 'error')
            return false;
        }

        if (parametro.tipo_campo === 'numerico' &&
            ((parametro.valorMinimo && parametro.valorMaximo) &&
                (parametro.valorMinimo < parametro.valorMaximo)
            )
        ) {
            addToast('Valor máximo no puede ser menor al minimo', 'error')
            return false;
        }

        if (parametro.tipo_campo === 'seleccion' && !parametro.opciones) {
            addToast('Por favor ingrese al menos dos opciones', 'error')
            return false;
        }
        return true;
    }

    const editarParametro = async () => {
        if (!validarDatos()) return;

        try {
            const datosParametro = new FormData();
            datosParametro.set('id', parametro.id.toString());
            datosParametro.set('nombre', parametro.nombre);
            datosParametro.set('tipo_campo', parametro.tipo_campo);
            datosParametro.set('abreviatura', parametro.abreviatura);
            datosParametro.set('unidad_metrica', parametro.unidad_metrica?.toString() || '');
            datosParametro.set('valorMinimo', parametro.valorMinimo?.toString() || '');
            datosParametro.set('valorMaximo', parametro.valorMaximo?.toString() || '');
            datosParametro.set('opciones', parametro.opciones?.toString() || '');

            const respuesta = await editarParametroAction(datosParametro);
            if (respuesta.status === 200) {
                if (parametros && setParametros) {
                    const nuevosParametros = parametros.map(param => param.id === parametro.id ? parametro : param);
                    setParametros(nuevosParametros);
                }
                addToast(respuesta.message || 'Parámetro guardado con éxito', 'success');
                setAbierto(false);
            } else {
                addToast('Ocurrió un error inesperado en el servidor', 'error');
            }
        } catch (err) {
            addToast('Ocurrió un error inesperado', 'error');
        }
    }

    const cancelarEdicion = () => {
        setParametro(datosParametro);
        setAbierto(false);
    }

    return (<>
        <Boton
            type="button"
            tipo="warning"
            onClick={() => setAbierto(true)}
        >
            <IconPencil stroke={2} />
        </Boton>
        {isClient && createPortal(
            <Modal
                titulo={'Crear nuevo parámetro'}
                abierto={abierto}
                setAbierto={() => setAbierto(!abierto)}
                botonesAccion={<>
                    <Boton
                        type="button"
                        onClick={cancelarEdicion}
                        tipo="danger"
                    >
                        <IconX stroke={2} />
                        Cancelar
                    </Boton>
                    <Boton type="button" tipo="warning" onClick={editarParametro}>
                        <IconPencil stroke={2} />
                        Guardar
                    </Boton>
                </>}
            >
                <FormularioParametro parametro={parametro} setParametro={setParametro} />
            </Modal>,
            document.body
        )}
    </>);
}

export default BotonEditarParametro;