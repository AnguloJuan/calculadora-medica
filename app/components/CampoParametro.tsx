'use client'

import { Parametro } from "@/utils/types";
import { Radio, RadioGroup } from "@headlessui/react";
import { IconCircle } from "@tabler/icons-react";
import { FunctionComponent, useState } from "react";
import { Each } from "./EachOf";

interface CampoParametroProps {
    parametro: Parametro;
}

const CampoParametro: FunctionComponent<CampoParametroProps> = (CampoParametroProps) => {
    const { parametro } = CampoParametroProps;
    const opciones = parametro.opciones?.split(',');
    const [valor, setValor] = useState<string | number>(
        parametro.tipo_campo === 'numerico' ? 0 : ''
    );

    return (
        <div className={`w-full grid grid-cols-2 gap-y-8 sm:grid-cols-6
        ${parametro.tipo_campo === 'radio' ? (opciones && opciones.length > 3 ? 'items-start' : 'items-center') : 'items-center'}`}>

            <label htmlFor={parametro.nombre} className="sm:col-span-3">{parametro.nombre}</label>
            {parametro.tipo_campo === 'numerico' && (
                <div className="flex flex-row sm:col-span-3">
                    <input
                        type="number"
                        id={parametro.nombre}
                        name={parametro.nombre}
                        min={parametro.valorMinimo}
                        max={parametro.valorMaximo}
                        value={valor}
                        onChange={(e) => setValor(Number(e.target.value))}
                        className="sm:col-span-3 mt-0 rounded-s-lg"
                    />
                    <div className="h-full col-span-1 text-center self-center p-2 bg-slate-300 border border-gray-300 rounded-e-lg">
                        <span className="text-sm/6">{parametro.unidad_metrica}</span>
                    </div>
                </div>
            )}

            {parametro.tipo_campo === 'seleccion' && (
                <select
                    id={parametro.nombre}
                    name={parametro.nombre}
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    className="sm:col-span-3"
                >
                    <option value="">Seleccione un parámetro</option>
                    {opciones?.map((opcion, index) =>
                        <option key={index} value={opcion}>{opcion}</option>
                    )}
                </select>
            )}

            {parametro.tipo_campo === 'radio' && opciones && (
                <div className="mx-auto w-full col-span-3">
                    <RadioGroup
                        id={parametro.nombre}
                        name={parametro.nombre}
                        value={valor}
                        onChange={setValor}
                        aria-label={parametro.nombre}
                        className={`${opciones.length > 3 ? 'space-y-2' : 'space-x-1'} 
                    ${opciones.length === 3 ? 'sm:grid sm:grid-cols-3' : opciones.length === 2 && 'grid grid-cols-2'}`}
                    >
                        {opciones &&
                            <Each
                                of={opciones}
                                render={(opcion, index) => (
                                    <Radio
                                        key={index}
                                        value={opcion}
                                        // if current value is checked then set the value to "" else set the value to the current value
                                        onClick={() => setValor(valor === opcion ? '' : opcion)}
                                        
                                        className="group relative flex w-full cursor-pointer rounded-lg col-span-1 bg-white border-gray-300 outline-gray-300 py-4 px-5 outline-none outline-offset-0 transition focus:outline-blue-500 data-[focus]:border-blue-500 data-[checked]:border-blue-500 data-[checked]:outline-blue-500"
                                    >
                                        <div className="flex w-full items-center justify-between">
                                            <div className="text-sm/6">
                                                <p className="font-semibold">{opcion}</p>
                                            </div>
                                            <span>
                                                <IconCircle className="absolute size-4 text-white fill-blue-500 opacity-0 transition group-data-[checked]:opacity-100 translate-y-1 translate-x-1" />
                                                <IconCircle className="size-6 text-blue-500 fill-white opacity-0 transition group-data-[checked]:opacity-100" />
                                            </span>
                                        </div>
                                    </Radio>
                                )}
                            />
                        }
                    </RadioGroup>
                </div>
            )}
        </div>
    );
}

export default CampoParametro;