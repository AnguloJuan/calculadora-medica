'use client'
import { useRef } from "react";
import { Boton } from "../../../components/Botones";

export default function Calcular({ formula }: { formula: string }) {
    const resultado = useRef<HTMLParagraphElement | null>(null);
    const calcularResultado = () => {
        //obtener valores de formulario
        const dataForm = new FormData(document.querySelector('calculadora') as HTMLFormElement);
        const valores = Object.fromEntries(dataForm.entries());

        //calcular resultado usando formula
    }
    return (<>
        <Boton type="button" variante="primary" estilo="mt-8" onClick={calcularResultado}>Calcular</Boton>

        <div className="flex flex-col gap-4">
            <p className="text-lg">Resultado:</p>
            <p className="text-lg font-bold" ref={resultado}>{resultado.current?.textContent}</p>
        </div>
    </>)
}