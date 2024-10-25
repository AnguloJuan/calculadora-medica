'use client'
import { Parametro, Unidad } from "@/utils/types";
import { IconPencil } from "@tabler/icons-react";
import { FunctionComponent, memo, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Boton } from "./Botones";
import FormularioParametro from "./FormularioParametro";
import Modal from "./Modal";

type BotonEditarParametroProps = {
    parametro: Parametro;
    unidadesParametro?: Unidad[];
    parametros?: Parametro[];
    setParametros?: (parametros: Parametro[]) => void;
}

const BotonActualizarParametro: FunctionComponent<BotonEditarParametroProps> = ({ parametro, unidadesParametro, parametros, setParametros }: BotonEditarParametroProps) => {
    const [abierto, setAbierto] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true)
    }, [])

    // const validarDatos = () => {
    //     // Validaciones de los campos del formulario
    //     if (!parametro.nombre || !parametro.tipo_campo) {
    //         addToast('Por favor llene todos los campos obligatorios', 'error')
    //         return false;
    //     }

    //     if (parametro.tipo_campo === 'numerico' &&
    //         ((parametro.valorMinimo && parametro.valorMaximo) &&
    //             (parametro.valorMinimo < parametro.valorMaximo)
    //         )
    //     ) {
    //         addToast('Valor máximo no puede ser menor al minimo', 'error')
    //         return false;
    //     }

    //     if (parametro.tipo_campo === 'seleccion' && !parametro.opciones) {
    //         addToast('Por favor ingrese al menos dos opciones', 'error')
    //         return false;
    //     }
    //     return true;
    // }

    // const editarParametro = async () => {
    //     if (!validarDatos()) return;

    //     try {
    //         const datosParametro = new FormData();
    //         datosParametro.set('id', parametro.id.toString());
    //         datosParametro.set('nombre', parametro.nombre);
    //         datosParametro.set('tipo_campo', parametro.tipo_campo);
    //         datosParametro.set('abreviatura', parametro.abreviatura?.toString() || '');
    //         datosParametro.set('valorMinimo', parametro.valorMinimo?.toString() || '');
    //         datosParametro.set('valorMaximo', parametro.valorMaximo?.toString() || '');
    //         datosParametro.set('opciones', parametro.opciones?.toString() || '');

    //         const respuesta = await editarParametroAction(datosParametro);
    //         if (respuesta.status === 200) {
    //             if (parametros && setParametros) {
    //                 const nuevosParametros = parametros.map(param => param.id === parametro.id ? parametro : param);
    //                 setParametros(nuevosParametros);
    //             }
    //             addToast(respuesta.message || 'Parámetro guardado con éxito', 'success');
    //             setAbierto(false);
    //         } else {
    //             addToast('Ocurrió un error inesperado en el servidor', 'error');
    //         }
    //     } catch (err) {
    //         addToast('Ocurrió un error inesperado', 'error');
    //     }
    // }

    // const cancelarEdicion = () => {
    //     setParametro(datosParametro);
    //     setAbierto(false);
    // }

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
                // botonesAccion={<>
                //     <Boton
                //         type="button"
                //         onClick={cancelarEdicion}
                //         variante="danger"
                //     >
                //         <IconX stroke={2} />
                //         Cancelar
                //     </Boton>
                //     <Boton type="button" variante="warning" onClick={editarParametro}>
                //         <IconPencil stroke={2} />
                //         Guardar
                //     </Boton>
                // </>}
            >
                <FormularioParametro parametros={parametros} setParametros={setParametros} setAbierto={setAbierto} accion="actualizar" parametro={parametro} unidadesParametro={unidadesParametro} />
            </Modal>,
            document.body
        )}
    </>);
}

export default memo(BotonActualizarParametro);