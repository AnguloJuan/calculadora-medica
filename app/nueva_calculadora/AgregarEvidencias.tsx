'use client'
import { useState } from "react";
import { Each } from "../components/EachOf";
import { IconTrash } from "@tabler/icons-react";
import { BotonAgregar } from "../components/Botones";

export default function AgregarEvidencias() {
    const [evidencia, setEvidencia] = useState<string>('');
    const [evidencias, setEvidencias] = useState<string[]>([]);
    return (
        <div className="w-full mt-2">
            <h2 className="w-full text-xl font-semibold text-center">Evidencias</h2>
            <label htmlFor="cita">Cita bibliográfica</label>
            <div className="flex flex-row gap-4">
                <input
                    type="text"
                    name="cita"
                    id="cita"
                    value={evidencia}
                    onChange={(e) => setEvidencia(e.target.value)}
                    placeholder="Ingrese la cita en formato APA"
                    className="rounded-lg"
                />
                <BotonAgregar
                    funcion={() => {
                        if (evidencia === '') {
                            return;
                        }
                        setEvidencias([...evidencias, evidencia]);
                        setEvidencia('');
                    }}
                >
                    Agregar más evidencia
                </BotonAgregar>
            </div>
            {evidencias.length > 0 && (<>
                <h3 className="my-2 text-lg font-semibold">Referencias</h3>
                <div className="flex gap-2 flex-col">
                    <Each of={evidencias} render={(evidencia) => (
                        <div className="flex flex-row justify-between gap-2 w-full">
                            <p className="text-sm font-light self-center">{evidencia}</p>
                            <button
                                type="button"
                                onClick={() => {
                                    setEvidencias(evidencias.filter(e => e !== evidencia));
                                }}
                                className="inline-flex flex-row bg-red-600 border-red-700 text-white px-4 py-2 rounded-lg items-center gap-2 w-full justify-center border border-transparent shadow-sm  hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto"
                            >
                                <IconTrash />
                                Eliminar
                            </button>
                        </div>
                    )} />
                </div>
            </>)}

            <input
                type="text"
                name="evidencias"
                id="evidencias"
                readOnly
                aria-readonly
                value={JSON.stringify(evidencias)}
                className="opacity-0 hidden size-0"
            />
        </div>
    )
}