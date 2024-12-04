import { DataTable } from "@/components/data-table";
import { ParametroColumn, parametroColumns } from "@/components/parametros/columns";
import CrearParametro from "@/components/parametros/CrearParametro";
import { conectarBd } from "@/db/conectarDb";
import { Parametro, Unidad } from "@/utils/types";
import { TypeParametroSchema } from "@/validationSchemas/ParametroSchema";
import { RowDataPacket } from "mysql2";

export default async function ParametrosPage() {
  const conexion = await conectarBd();
  const obtenerParametros = async () => {
    interface Parametros extends RowDataPacket, Parametro { }
    interface Unidades extends RowDataPacket, Unidad { }
    async function obtenerParams() {
      try {
        const [parametros] = await conexion.query<Parametros[]>(
          'SELECT * FROM `parametro`',
        );
        return parametros;
      } catch (error) {
        console.error(error);
        return [];
      }
    }
    const parametros = await obtenerParams();
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
  const parametros: TypeParametroSchema[] = await obtenerParametros();
  const data: ParametroColumn[] = parametros ? parametros.map((parametro) => {
    return {
      id: parametro.id,
      nombre: parametro.nombre,
      tipo_campo: parametro.tipo_campo,
      unidadesOpciones: parametro.tipo_campo === "seleccion" || parametro.tipo_campo === "radio" ? parametro.opciones! :
        parametro.tipo_campo === "numerico" ? parametro.unidades?.map((unidad) => unidad.nombre) || [] : "No definido",
      parametro: parametro
    }
  }) : []

  return (<>
    <header className="bg-background dark:bg-container shadow">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight">Parametros</h1>
      </div>
    </header>
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="bg-background dark:bg-container shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 space-y-4">
          <h3 className="text-lg font-medium leading-6">Parametros</h3>
          <CrearParametro />
          <div className="container mx-auto">
            <DataTable columns={parametroColumns} data={data} filter="nombre" />
          </div>
        </div>
      </div>
    </main>
  </>)
}
