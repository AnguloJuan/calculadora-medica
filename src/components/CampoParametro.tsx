'use client'

import { Radio, RadioGroup } from "@headlessui/react";
import { IconCircle } from "@tabler/icons-react";
import { FunctionComponent, useState } from "react";
import { Parametro, Unidad } from "../utils/types";
import { Each } from "./EachOf";

interface CampoParametroProps {
  parametro: Parametro;
  setParametros?: (parametros: Parametro[]) => void;
  parametros?: Parametro[];
  unidades?: Unidad[];
  form?: string;
}

const CampoParametro: FunctionComponent<CampoParametroProps> = ({ parametro, setParametros, parametros, unidades, form }: CampoParametroProps) => {
  const opciones = parametro.opciones?.split(',');
  const [valor, setValor] = useState<string | number>(
    parametro.tipo_campo === 'numerico' ? 0 : ''
  );

  // Acutalizar unidadActual del parametro en el estado parametros
  function actualizarUnidadActual(unidad: Unidad) {
    if (!parametros || !setParametros) return;

    const index = parametros?.findIndex((param) => param.id === parametro.id);
    const acutalizarParametos = [...parametros];
    // Crear nuevo objeto con unidad actualizada
    acutalizarParametos[index] = { ...parametro, unidadActual: unidad };
    setParametros(acutalizarParametos);
  }

  return (
    <div className={`w-full grid grid-cols-2 gap-y-8 sm:grid-cols-6
        ${parametro.tipo_campo === 'radio' ? (opciones && opciones.length > 3 ? 'items-start' : 'items-center') : 'items-center'}`}>

      <label htmlFor={parametro.nombre} className="sm:col-span-3">{parametro.nombre}</label>
      {parametro.tipo_campo === 'numerico' && (
        <div className="flex flex-row sm:col-span-3">
          <input
            type="number"
            id={`campo_${parametro.nombre}`}
            name={`campo_${parametro.nombre}`}
            min={parametro.valorMinimo}
            max={parametro.valorMaximo}
            value={valor}
            onChange={(e) => setValor(Number(e.target.value))}
            form={form}
            className="sm:col-span-3 mt-0 rounded-s-lg"
          />
          <div className="h-full col-span-1 text-center self-center p-2 bg-slate-300 border border-gray-300 rounded-e-lg">
            {/* {unidades?.map((unidad, index) => (
                            <p key={index} className="text-sm/6">{unidad.unidad}</p>
                        ))} */}
            {unidades && (
              unidades.length === 1 ? (
                <span className="text-sm/6">{unidades[0].unidad}</span>
              ) : unidades.length > 1 && (
                <select
                  id={`unidad_${parametro.nombre}`}
                  name={`unidad_${parametro.nombre}`}
                  className="text-sm/6"
                  onChange={(e) => {
                    const unidad = unidades.find((unidad) => unidad.id === Number(e.target.value));
                    if (unidad) {
                      actualizarUnidadActual(unidad);
                    }
                  }}
                >
                  {unidades.map((unidad, index) => (
                    <option key={index} value={unidad.id}>{unidad.unidad}</option>
                  ))}
                </select>
              )
            )}
          </div>
        </div>
      )}

      {parametro.tipo_campo === 'seleccion' && (
        <select
          id={`campo_${parametro.nombre}`}
          name={`campo_${parametro.nombre}`}
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          form={form}
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
            id={`campo_${parametro.nombre}`}
            name={`campo_${parametro.nombre}`}
            value={valor}
            onChange={setValor}
            aria-label={parametro.nombre}
            form={form}
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