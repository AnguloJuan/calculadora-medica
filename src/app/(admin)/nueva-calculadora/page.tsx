

import { conectarBd } from "@/db/conectarDb";
import { Parametro, Unidad } from "@/utils/types";
import { TypeParametroSchema } from "@/validationSchemas/ParametroSchema";
import { RowDataPacket } from "mysql2";
import { NextRequest } from "next/server";
import FormularioNuevaCalculadora from "./FormularioNuevaCalculadora";

export default async function NuevaCalculadora({ request }: { request: NextRequest }) {
  const conexion = await conectarBd()
  const obtenerParametros = async () => {
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

  const parametrosObtenidos = await obtenerParametros();

  const obtenerUnidades = async (parametros: Parametro[]) => {
    interface Unidades extends RowDataPacket, Unidad { }
    const parametrosConUnidades = parametros.map(async (parametro) => {
      try {
        const [unidadesRows] = await conexion.query<Unidades[]>(
          'SELECT * FROM `parametro_unidad` as `pu` RIGHT JOIN `unidad` as `u` ON pu.id_unidad = u.id AND `id_parametro` = ? WHERE pu.id IS NOT NULL;',
          [parametro.id],
        );
        return { ...parametro, unidades: unidadesRows }
      } catch (error) {
        console.error(error);
        return undefined;
      }
    });

    const resolvedParametros = await Promise.all(parametrosConUnidades);
    return resolvedParametros.filter((parametro) => parametro !== undefined) as TypeParametroSchema[];
  }
  const parametros: TypeParametroSchema[] = await obtenerUnidades(parametrosObtenidos!);

  return (
    <div className="w-full items-center flex justify-center my-8">
      <FormularioNuevaCalculadora parametros={parametros} />
    </div>
  );
}