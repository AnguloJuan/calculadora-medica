'use client'
import { crearParametroAction } from "@/utils/actions";
import { Parametro } from "@/utils/types";
import { IconPlus, IconX } from "@tabler/icons-react";
import { FunctionComponent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Boton } from "./Botones";
import FormularioParametro from "./FormularioParametro";
import Modal from "./Modal";
import { useToast } from "./Toast";

interface BotonAgregarParametroProps {
    parametros?: Parametro[];
    setParametros?: (parametros: Parametro[]) => void;
}

const BotonAgregarParametro: FunctionComponent<BotonAgregarParametroProps> = ({ parametros, setParametros }: BotonAgregarParametroProps) => {
    const [abierto, setAbierto] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const { addToast } = useToast();
    const [parametro, setParametro] = useState<Parametro>({
        id: 0,
        nombre: '',
        abreviatura: '',
        tipo_campo: 'numerico',
        unidad_metrica: '',
        valorMaximo: undefined,
        valorMinimo: undefined,
        opciones: '',
    });

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

    const crearParametro = async () => {
        if (!validarDatos()) return;

        try {
            const datosParametro = new FormData();
            datosParametro.set('nombre', parametro.nombre);
            datosParametro.set('tipo_campo', parametro.tipo_campo);
            datosParametro.set('abreviatura', parametro.abreviatura);
            datosParametro.set('unidad_metrica', parametro.unidad_metrica?.toString() || '');
            datosParametro.set('valorMinimo', parametro.valorMinimo?.toString() || '');
            datosParametro.set('valorMaximo', parametro.valorMaximo?.toString() || '');
            datosParametro.set('opciones', parametro.opciones?.toString() || '');

            const respuesta = await crearParametroAction(datosParametro);
            if (respuesta.id) {
                const parametroConId = { ...parametro, id: respuesta.id };
                setParametro({ ...parametro, id: respuesta.id });
                setParametros && parametros && setParametros([...parametros, parametroConId]);
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
            <Boton tipo="success" type="button" onClick={() => setAbierto(true)}>
                <IconPlus stroke={2} />
                Crear nuevo parámetro
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
                    <Boton type="button" tipo="success" onClick={crearParametro}>
                        <IconPlus stroke={2} />
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

export default BotonAgregarParametro;