'use client'
import { CalculadoraZ } from "@/utils/types";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useToast } from "../components/Toast";

export default function BotonGuardarCalculadora() {
    const { addToast } = useToast();
    const GuardarCalculadora = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const formulario = new FormData(document.getElementById("form_calculadora") as HTMLFormElement);
        formulario.set('id', '0')
        const datosFormulario = Object.fromEntries(formulario.entries());
        const validarCalcudora = CalculadoraZ.omit({ parametros: true, evidencias: true }).safeParse(datosFormulario);
        if (!validarCalcudora.success) {
            // const errores = validarCalcudora.error.formErrors;
            const errores = validarCalcudora.error.format();
            console.log(errores);
            addToast(
                `Por favor llene todos los campos obligatorios: ${Object.values(errores._errors).join(', ')}`,
                'error'
            );
            
            return;
        }

    }

    return (
        <button
            type="button"
            onClick={GuardarCalculadora}
            className="flex flex-row bg-green-600 border-green-700 text-white px-4 py-2 rounded-lg items-center gap-2"
        >
            <IconDeviceFloppy stroke={2} />
            Guardar
        </button>
    )
}