'use client'

import { Parametro, Valor } from "@/utils/types";
import { FunctionComponent, useState } from "react";
import { Each } from "./EachOf";
import { Radio, RadioGroup } from "@headlessui/react";
import { IconCircle } from "@tabler/icons-react";

interface CampoParametroProps {
    parametro: Parametro;
    valores?: Valor[];
}

const CampoParametro: FunctionComponent<CampoParametroProps> = (CampoParametroProps) => {
    const { parametro, valores } = CampoParametroProps;
    const [seleccionado, setSeleccionado] = useState<typeof valores>();
    const [valor, setValor] = useState('');

    return (
        <div className={`w-full mt-10 grid grid-cols-2 gap-y-8 sm:grid-cols-6
        ${parametro.tipo === 'radio' ? (valores && valores.length > 3 ? 'items-start' : 'items-center') : 'items-center'}`}>
            <label htmlFor={parametro.nombre} className="sm:col-span-3">{parametro.nombre}</label>
            {parametro.tipo === 'numerico' && (
                <input type="number" className="sm:col-span-3 rounded-lg" name={parametro.nombre} id={parametro.nombre} />
            )}

            {parametro.tipo === 'seleccion' && (
                <select name="parametros" id="parametros" className="sm:col-span-3">
                    <option value="0">Seleccione un parámetro</option>
                    {valores &&
                        <Each
                            of={valores}
                            render={(valor) => (
                                <option key={valor.id} value={valor.id}>
                                    {valor.valor}
                                </option>
                            )}
                        />
                    }

                </select>
            )}

            {parametro.tipo === 'radio' && valores && (
                <div className="mx-auto w-full col-span-3">
                    <RadioGroup
                        by={'valor'}
                        value={seleccionado}
                        onChange={setSeleccionado}
                        aria-label={parametro.nombre}
                        className={`${valores.length > 3 ? 'space-y-2' : 'space-x-1'} 
                    ${valores.length === 3 ? 'sm:grid sm:grid-cols-3' : valores.length === 2 && 'grid grid-cols-2'}`}
                    >
                        {valores &&
                            <Each
                                of={valores}
                                render={(valor) => (
                                    <Radio
                                        key={valor.valor}
                                        value={valor}
                                        className="group relative flex w-full cursor-pointer rounded-lg col-span-1 bg-white border-gray-300 outline-gray-300 py-4 px-5 outline-none outline-offset-0 transition focus:outline-blue-500 data-[focus]:border-blue-500 data-[checked]:border-blue-500 data-[checked]:outline-blue-500"
                                    >
                                        <div className="flex w-full items-center justify-between">
                                            <div className="text-sm/6">
                                                <p className="font-semibold">{valor.valor}</p>
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