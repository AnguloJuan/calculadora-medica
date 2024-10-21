'use client'
import { crearCalculadoraAction } from "@/utils/actions";
import { CalculadoraZ, Parametro } from "@/utils/types";
import { IconDeviceFloppy } from "@tabler/icons-react";
import Link from "next/link";
import { Boton } from "../components/Botones";
import { useToast } from "../components/Toast";

export default function BotonGuardarCalculadora() {
    const { addToast } = useToast();

    const validarDatos = (datosFormulario: { [k: string]: FormDataEntryValue }) => {

        const validarCalcudora = CalculadoraZ.safeParse(datosFormulario);

        if (!validarCalcudora.success) {
            // const errores = validarCalcudora.error.formErrors;
            const errores = Object.keys(validarCalcudora.error.formErrors.fieldErrors).join(', ');
            addToast(
                `Por favor llene todos los campos obligatorios: ${errores}`,
                'error'
            );
            return false;
        }

        const { parametros, evidencias } = datosFormulario;
        const parametrosArray = JSON.parse(parametros as string) as Parametro[];
        const evidenciasArray = JSON.parse(evidencias as string) as string[];

        if (parametrosArray.length === 0) {
            addToast(
                'Por favor agregue al menos un parámetro',
                'error'
            );
            return false;
        }

        if (evidenciasArray.length === 0) {
            addToast(
                'Por favor agregue al menos una evidencia',
                'error'
            );
            return false;
        }
        return true;
    }

    const guardarCalculadora = async () => {
        const formulario = new FormData(document.getElementById("form_calculadora") as HTMLFormElement);
        formulario.set('id', '0');
        formulario.set('enlace', '');
        const datosFormulario = Object.fromEntries(formulario.entries());

        if (!validarDatos(datosFormulario)) return;

        const respuesta = await crearCalculadoraAction(formulario)
        if (respuesta.error) {
            addToast(
                respuesta.error,
                'error'
            );
            return;
        }

        addToast(
            <>
                Calculadora guardada exitosamente <br />
                haz click para verla: {' '}
                <Link
                    href={`/calculadoras/${respuesta.enlace}`}
                    className="underline text-blue-500 cursor-pointer hover:text-blue-700 transition-colors"
                >
                    ver calculadora
                </Link>
            </>,
            'success'
        );
    }

    return (
        <Boton
            type="button"
            tipo="success"
            onClick={guardarCalculadora}
        >
            <IconDeviceFloppy stroke={2} />
            Guardar
        </Boton>
    )
}