

import { conectarBd } from "@/db/conectarDb";
import { Parametro } from "@/utils/types";
import { RowDataPacket } from "mysql2";
import { NextRequest } from "next/server";
import FormularioNuevaCalculadora from "./FormularioNuevaCalculadora";

export default async function NuevaCalculadora({ request }: { request: NextRequest }) {
  const obtenerParametros = async () => {
    const conexion = await conectarBd()
    interface Parametros extends RowDataPacket, Parametro { }
    try {
      const [parametrosRows] = await conexion.query<Parametros[]>(
        'SELECT * FROM `parametro`',
      );

      return parametrosRows;
    } catch (error) {
      console.error(error);
    }
  }

  const parametros = await obtenerParametros();

  return (
    <div className="w-full items-center flex justify-center my-8">
      <FormularioNuevaCalculadora parametros={parametros} />
    </div>
  );
}