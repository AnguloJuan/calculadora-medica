'use client'

import { cn } from "@/lib/utils"
import { TypeParametroSchema } from "@/validationSchemas/ParametroSchema"
import { IconCircle, IconSwitchHorizontal } from "@tabler/icons-react"
import { useCallback, useState } from "react"
import { Unidad } from "../../utils/types"
import { Each } from "../EachOf"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

type Parametro = TypeParametroSchema & {
  unidadPredeterminada?: Unidad;
}

interface CampoParametroProps {
  parametro: Parametro;
  onChange?: (parametro: string, valor: number | string) => void;
}

export default function CampoParametro({ parametro, onChange }: CampoParametroProps) {
  return (
    <div className="w-full gap-y-2 flex flex-col items-start">
      <Label htmlFor={parametro.nombre}>{parametro.nombre}</Label>
      {parametro.tipo_campo === 'numerico' && (
        <NumberInput
          parametro={parametro}
          onChange={onChange}
        />
      )}
      {(parametro.tipo_campo === 'seleccion' || parametro.tipo_campo === 'radio') && (
        <SeleccionInput
          parametro={parametro}
          onChange={onChange}
        />
      )}
    </div>
  );
}

function NumberInput({ parametro, onChange }: CampoParametroProps) {
  const [unidad, setUnidad] = useState<string>(parametro.unidades ? parametro.unidades[0].unidad : undefined);
  const [valor, setValor] = useState<string | number>('');

  const validarNumero = useCallback((valor: string | number) => {
    const match = String(valor).match(/[+-]?(\d+\.\d*|\d*\.\d+|\d*)$/)
    if (match && match[0] === String(valor)) {
      setValor(valor);
      onChange && onChange(parametro.nombre, Number(valor));
    }
  }, [parametro.nombre, onChange]);

  return (
    <div className="flex flex-row w-full">
      <Input
        type="text"
        id={`campo_${parametro.nombre}`}
        name={`campo_${parametro.nombre}`}
        min={parametro.valorMinimo}
        max={parametro.valorMaximo}
        value={valor}
        onChange={(e) => { validarNumero(e.target.value) }}
        className="mt-0 rounded-e-none"
      />
      {parametro.unidades && (
        <div className={cn("text-center content-center bg-muted rounded-e-lg",
          parametro.unidades.length === 1 ?
            "h-9 px-2 min-w-fit border border-input text-xs lg:text-sm font-medium"
            : 'p-0 ')
        }>
          {parametro.unidades.length === 1 ? (
            <span>{parametro.unidades[0].unidad}</span>
          ) : parametro.unidades.length === 2 ? (
            <Button
              variant="outline"
              className="h-full text-xs lg:text-sm font-medium px-2 rounded-e-lg rounded-s-none border-input"
              onClick={() => {
                if (!parametro.unidades || parametro.unidades.length < 2) return;
                if (unidad === parametro.unidades[0].unidad)
                  setUnidad(parametro.unidades[1].unidad);
                else
                  setUnidad(parametro.unidades[0].unidad);
                // setValor( valor ); Actualizar el valor con la conversion de la unidad
              }}
            >
              <span>{unidad}</span>
              <IconSwitchHorizontal className="size-2 md:size-4" />
            </Button>
          ) : parametro.unidades.length > 2 && (
            <Select
              name={`unidad_${parametro.nombre}`}
              defaultValue={parametro.unidadPredeterminada ? String(parametro.unidadPredeterminada?.id) : String(parametro.unidades[0].id)}
              onValueChange={(e) => {
                // setValor( valor ); Actualizar el valor con la conversion de la unidad
              }}
            >
              <SelectTrigger className="h-full text-xs lg:text-sm font-medium px-2 rounded-e-lg rounded-s-none border-input" >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {parametro.unidades.map((unidad, index) => (
                  <SelectItem key={index} value={String(unidad.id)}>{unidad.unidad}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}
    </div>
  )
}

function SeleccionInput({ parametro, onChange }: CampoParametroProps) {
  const opciones = parametro.opciones !== '' ? parametro.opciones?.split(',') : undefined;
  const [valor, setValor] = useState<string | number>('');

  if (!opciones || opciones.length === 0) {
    return <p className="text-red-500">No hay opciones disponibles para este campo.</p>
  }

  if (parametro.tipo_campo === 'seleccion') {
    return (
      <Select
        name={`campo_${parametro.nombre}`}
        onValueChange={(e) => {
          setValor(e)
          onChange && onChange(parametro.nombre, Number(e))
        }}
        defaultValue=""
        value={String(valor)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecciona una opción" />
        </SelectTrigger>
        <SelectContent>
          <Each
            of={opciones}
            render={(opcion, index) => (<>
              {opcion !== '' && <SelectItem key={index} value={String(index)}>{opcion}</SelectItem>}
            </>)} />
        </SelectContent>
      </Select>
    )
  }
  if (parametro.tipo_campo === 'radio') {
    return (
      <div className="mx-auto w-full">
        <RadioGroup
          id={`campo_${parametro.nombre}`}
          name={`campo_${parametro.nombre}`}
          onValueChange={(value) => {
            onChange && onChange(parametro.nombre, Number(value))
          }}
          aria-label={parametro.nombre}
          className={`flex flex-col gap-2 w-full justify-between`}
        // ${opciones.length > 3 ? 'flex-col' : 'flex-col'} 
        >
          <Each
            of={opciones}
            render={(opcion, index) => (
              <RadioGroupItem
                key={index}
                value={opcion}
                onClick={() => {
                  setValor(valor === opcion ? '' : opcion)
                  onChange && onChange(parametro.nombre, Number(index))
                }}
                className="group relative flex w-full cursor-pointer rounded-lg col-span-1 bg-background border-gray-300 outline-gray-300 py-2 px-5 outline-none outline-offset-0 transition focus:outline-blue-500 data-[focus]:border-blue-500 data-[checked]:border-blue-500 data-[checked]:outline-blue-500"
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
              </RadioGroupItem>
            )}
          />
        </RadioGroup>
      </div>
    )
  }
}