'use client'

import { TypeParametroSchema } from "@/validationSchemas/ParametroSchema"
import { Radio, RadioGroup } from "@headlessui/react"
import { IconCircle } from "@tabler/icons-react"
import { FunctionComponent, useState } from "react"
import { Unidad } from "../utils/types"
import { Each } from "./EachOf"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

type Parametro = TypeParametroSchema & {
  unidadActual?: Unidad;
}

interface CampoParametroProps {
  parametro: Parametro;
  setParametros?: (parametros: Parametro[]) => void;
  parametros?: Parametro[];
  onChange?: (parametro: string, valor: number) => void;
}

const CampoParametro: FunctionComponent<CampoParametroProps> = ({ parametro, setParametros, parametros, onChange }) => {
  const opciones = (parametro.tipo_campo === 'seleccion' || parametro.tipo_campo === 'radio') ? parametro.opciones?.split(',') : undefined;
  const [valor, setValor] = useState<string | number>(
    parametro.tipo_campo === 'numerico' ? 0 : ''
  );

  function actualizarUnidadActual(unidad: Unidad) {
    if (!parametros || !setParametros) return;

    const index = parametros.findIndex((param) => param.id === parametro.id);
    const acutalizarParametos = [...parametros];
    acutalizarParametos[index] = { ...parametro, unidadActual: unidad };
    setParametros(acutalizarParametos);
  }

  return (
    <div className={`w-full grid grid-cols-2 gap-y-8 sm:grid-cols-6
        ${parametro.tipo_campo === 'radio' ? (opciones && opciones.length > 3 ? 'items-start' : 'items-center') : 'items-center'}`}>

      <Label htmlFor={parametro.nombre} className="sm:col-span-3">{parametro.nombre}</Label>
      {parametro.tipo_campo === 'numerico' && (
        <div className="flex flex-row sm:col-span-3">
          <Input
            type="number"
            id={`campo_${parametro.nombre}`}
            name={`campo_${parametro.nombre}`}
            min={parametro.valorMinimo}
            max={parametro.valorMaximo}
            value={valor}
            onChange={(e) => { setValor(e.target.value); onChange && onChange(parametro.nombre, e.target.valueAsNumber) }}
            className="sm:col-span-3 mt-0 rounded-e-none"
          />
          <div className="h-9 col-span-1 text-center self-cente content-center px-4 bg-slate-200 border border-input rounded-e-lg">
            {parametro.unidades && (
              parametro.unidades.length === 1 ? (
                <small className="text-sm font-medium leading-none">{parametro.unidades[0].unidad}</small>
              ) : parametro.unidades.length > 1 && (
                <Select
                  name={`unidad_${parametro.nombre}`}
                  defaultValue={String(parametro.unidadActual?.id)}
                  onValueChange={(e) => {
                    const unidad = parametro.unidades!.find((unidad) => unidad.id === Number(e)) ;
                    if (unidad) {
                      actualizarUnidadActual(unidad);
                    }
                  }}
                >
                  <SelectContent>
                    {parametro.unidades.map((unidad, index) => (
                      <SelectItem key={index} value={String(unidad.id)}>{unidad.unidad}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )
            )}
          </div>
        </div>
      )}

      {parametro.tipo_campo === 'seleccion' && (
        <Select
          name={`campo_${parametro.nombre}`}
          onValueChange={(e) => setValor(e)}
          defaultValue=""
          value={String(valor)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una opción" />
          </SelectTrigger>
          <SelectContent>
            {opciones?.map((opcion, index) =>
              <SelectItem key={index} value={opcion}>{opcion}</SelectItem>
            )}
          </SelectContent>
        </Select>
      )}

      {parametro.tipo_campo === 'radio' && opciones && (
        <div className="mx-auto w-full col-span-3">
          <RadioGroup
            id={`campo_${parametro.nombre}`}
            name={`campo_${parametro.nombre}`}
            value={valor}
            onChange={setValor}
            aria-label={parametro.nombre}
            className={`${opciones.length > 3 ? 'space-y-2' : 'space-x-1'} 
                    ${opciones.length === 3 ? 'sm:grid sm:grid-cols-3' : opciones.length === 2 && 'grid grid-cols-2'}`}
          >
            <Each
              of={opciones}
              render={(opcion, index) => (
                <Radio
                  key={index}
                  value={opcion}
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
          </RadioGroup>
        </div>
      )}
    </div>
  );
}

export default CampoParametro;