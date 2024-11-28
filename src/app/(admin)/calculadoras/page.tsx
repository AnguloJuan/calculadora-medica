import CrearCalculadora from "@/components/calculadoras/CrearCalculadora";
import { conectarBd } from "@/db/conectarDb";
import { Parametro, Unidad } from "@/utils/types";
import { TypeParametroSchema } from "@/validationSchemas/ParametroSchema";
import { RowDataPacket } from "mysql2";

const CalculadorasPage = async () => {
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

  return (<>
    <header className="bg-background dark:bg-container shadow">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight">Calculadoras</h1>
      </div>
    </header>
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="bg-background dark:bg-container shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 space-y-4">
          <h3 className="text-lg font-medium leading-6">Calculadoras</h3>
          <CrearCalculadora parametros={parametros} />
        </div>
      </div>
    </main>
  </>)
}

export default CalculadorasPage