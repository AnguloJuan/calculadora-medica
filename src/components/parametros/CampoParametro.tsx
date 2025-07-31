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

interface CampoParametroProps {
  parametro: TypeParametroSchema;
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
  if (parametro.tipo_campo !== 'numerico') return null;
  const [unidad, setUnidad] = useState<string>(parametro.unidades.length ? parametro.unidades[0].unidad : '');
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
              variant="ghost"
              type="button"
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
              defaultValue={parametro.unidades[0].id ? String(parametro.unidades[1].id) : String(parametro.unidades[0].id)}
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
  if (parametro.tipo_campo !== 'seleccion' && parametro.tipo_campo !== 'radio') return null;
  if (!parametro.opciones) return null;
  const opciones = parametro.opciones?.split(',');
  const [valor, setValor] = useState<string>('');

  if (!opciones || opciones.length === 0) {
    return <p className="text-red-500">No hay opciones disponibles para este campo.</p>
  }

  if (parametro.tipo_campo === 'seleccion') {
    return (
      <Select
        name={`campo_${parametro.nombre}`}
        onValueChange={(e) => {
          const valorActualizado = e === valor ? '' : e;
          setValor(valorActualizado)
          onChange && onChange(parametro.nombre, Number(valorActualizado))
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
      <RadioGroup
        value={valor}
        onValueChange={(value) => {
          onChange && onChange(parametro.nombre, Number(value))
        }}
        className={`mx-auto w-full flex gap-2 justify-between ${opciones.length > 2 ? 'flex-col' : 'flex-row'} `}
      >
        <Each
          of={opciones}
          render={(opcion, index) => (<>
            <div className="relative w-full">
              <RadioGroupItem
                key={index}
                id={opcion}
                value={opcion}
                onClick={() => {
                  setValor(valor === opcion ? '' : opcion)
                  onChange && onChange(parametro.nombre, Number(index))
                }}
                className={`peer opacity-0 z-10 w-full h-full absolute cursor-pointer rounded-lg`}
              />
              <div
                data-state={valor === opcion ? 'checked' : 'unchecked'}
                className={`group flex flex-row items-center w-full px-2 py-2 rounded-lg bg-accent/80 hover:bg-accent hover:border-border/80 border-2 peer-data-[state=checked]:border-blue-400`}
              >
                <Label htmlFor={opcion} className="w-full items-center justify-between font-semibold text-foreground transition group-data-[state=checked]:text-blue-500">
                  {opcion}
                </Label>
                <span>
                  <IconCircle className="absolute size-4 text-transparent fill-blue-500 opacity-0 transition group-data-[state=checked]:opacity-100 translate-y-1 translate-x-1" />
                  <IconCircle className="size-6 text-blue-500 opacity-0 transition group-data-[state=checked]:opacity-100" />
                </span>
              </div>
            </div>
          </>
          )}
        />
      </RadioGroup>
    )
  }
}