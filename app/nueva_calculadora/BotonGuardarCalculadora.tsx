'use client'
import { CalculadoraZ, Parametro } from "@/utils/types";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useToast } from "../components/Toast";
import { Boton } from "../components/Botones";
import { crearCalculadoraAction } from "@/utils/actions";

export default function BotonGuardarCalculadora() {
    const { addToast } = useToast();

    const validarDatos = (datosFormulario: { [k: string]: FormDataEntryValue }) => {

        const validarCalcudora = CalculadoraZ.omit({ parametros: true, evidencias: true }).safeParse(datosFormulario);

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
        const evidenciasArray = JSON.parse(evidencias as string) as Parametro[];

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
        formulario.set('id', '0')
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
            'Calculadora guardada exitosamente',
            'success'
        );

        // navigate(`/calculadora/${respuesta.id}`);
    }

    return (
        <Boton
            color="green"
            funcion={guardarCalculadora}
        >
            <IconDeviceFloppy stroke={2} />
            Guardar
        </Boton>
    )
}