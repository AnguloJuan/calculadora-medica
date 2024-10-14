'use client'
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { Boton } from "../components/Botones";
import { Each } from "../components/EachOf";

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
                <Boton
                    color="green"
                    funcion={() => {
                        if (evidencia === '') {
                            return;
                        }
                        setEvidencias([...evidencias, evidencia]);
                        setEvidencia('');
                    }}
                >
                    <IconPlus stroke={2} />
                    Agregar evidencia
                </Boton>
            </div>
            {evidencias.length > 0 && (<>
                <h3 className="my-2 text-lg font-semibold">Referencias</h3>
                <div className="flex gap-2 flex-col">
                    <Each of={evidencias} render={(evidencia) => (
                        <div className="flex flex-row justify-between gap-2 w-full">
                            <p className="text-sm font-light self-center">{evidencia}</p>
                            <Boton
                                color="red"
                                funcion={() => {
                                    setEvidencias(evidencias.filter(e => e !== evidencia));
                                }}
                            >
                                <IconTrash />
                                Eliminar
                            </Boton>
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