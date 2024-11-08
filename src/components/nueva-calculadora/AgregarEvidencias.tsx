'use client'
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { Boton } from "../Botones";
import { Each } from "../EachOf";

export default function AgregarEvidencias() {
  const [evidencia, setEvidencia] = useState<string>('');
  const [evidencias, setEvidencias] = useState<string[]>([]);
  return (
    <div className="w-full mt-2">
      <h2 className="w-full text-xl font-semibold text-center">Evidencias</h2>
      <div className="flex flex-col gap-4">
        <fieldset className="w-full flex flex-col gap-2">
          <label htmlFor="cita">Cita bibliográfica*</label>
          <input
            type="text"
            name="cita"
            id="cita"
            value={evidencia}
            onChange={(e) => setEvidencia(e.target.value)}
            placeholder="Ingrese la cita en formato APA"
            className="rounded-lg"
          />
        </fieldset>
        <fieldset className="w-full flex flex-col gap-2">
          <label htmlFor="enlace_evidencia">Enlace de evidencia</label>
          <input
            type="text"
            id="enlace_evidencia"
            name="enlace_evidencia"
            className="rounded-lg"
          />
        </fieldset>
        <Boton
          type="button"
          variante="success"
          onClick={() => {
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
                type="button"
                variante="danger"
                onClick={() => {
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