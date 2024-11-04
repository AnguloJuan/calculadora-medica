'use client'
import { useRef } from "react";
import { Boton } from "../../../../components/Botones";

export default function Calcular({ formula }: { formula: string }) {
    const resultado = useRef<HTMLParagraphElement | null>(null);
    const calcularResultado = () => {
        //obtener valores de formulario
        const dataForm = new FormData(document.querySelector('calculadora') as HTMLFormElement);
        const valores = Object.fromEntries(dataForm.entries());

        //calcular resultado usando formula
    }
    return (<>
        <Boton type="button" variante="primary" onClick={calcularResultado}>Calcular</Boton>

        <div className="flex flex-row gap-4 w-full bg-slate-50 rounded p-8 py-4 ">
            <p className="text-lg">Resultado:</p>
            <p className="text-lg font-bold" ref={resultado}>40{resultado.current?.textContent}</p>
        </div>
    </>)
}