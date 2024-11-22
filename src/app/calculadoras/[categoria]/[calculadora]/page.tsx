
import Calculadora from "@/components/Calculadora";
import { conectarBd } from "@/db/conectarDb";
import { Calculadora as ICalculadora, Parametro, Unidad } from "@/utils/types";
import { TypeParametroSchema } from "@/validationSchemas/ParametroSchema";
import { RowDataPacket } from "mysql2";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

interface RowsCalculadora extends RowDataPacket, ICalculadora { }
interface Parametros extends RowDataPacket, Parametro { }
interface Unidades extends RowDataPacket, Unidad { }
interface IParametro extends TypeParametroSchema {
  unidadActual?: Unidad;
}

export default async function CalculadoraPage({ params, request }: { params: { calculadora: string }, request: NextRequest }) {
  const conexion = await conectarBd();
  async function obtenerCalculadora() {
    try {
      const [rows] = await conexion.query<RowsCalculadora[]>('SELECT * FROM calculadora WHERE enlace = ?', [params.calculadora]);

      if (rows.length === 0) {
        redirect('/404');
      }

      return rows[0];
    } catch (error) {
      console.error(error);
      redirect('/404');
    }
  }
  const calculadora: ICalculadora = await obtenerCalculadora();

  async function obtenerParametros() {
    try {
      const [parametrosRows] = await conexion.query<Parametros[]>(
        'SELECT * FROM `calculadora_parametro` as `cp` RIGHT JOIN `parametro` as `p` ON cp.id_calculadora = p.id AND id_calculadora = ?',
        [calculadora.id]
      );

      if (parametrosRows.length === 0) {
        console.log('No se encontraron parametros');
        redirect('/404');
      }

      const parametrosConUnidades = parametrosRows.map(async (parametro) => {
        try {
          const [unidadesRows] = await conexion.query<Unidades[]>(
            'SELECT * FROM `parametro_unidad` as `pu` RIGHT JOIN `unidad` as `u` ON pu.id_unidad = u.id AND `id_parametro` = ? WHERE pu.id IS NOT NULL;',
            [parametro.id],
          );
          return { ...parametro, unidades: unidadesRows, unidadActual: unidadesRows[0] };
        } catch (error) {
          console.error(error);
          return undefined;
        }
      });

      const resolvedParametros = await Promise.all(parametrosConUnidades);
      return resolvedParametros.filter((parametro) => parametro !== undefined) as IParametro[];
    } catch (error) {
      console.error(error);
      redirect('/404');
    }
  }

  const parametros: IParametro[] = await obtenerParametros();

  return (
    <div className="w-full h-full bg-white flex flex-col items-center">
      <main className="flex md:max-w-screen-md lg:max-w-screen-lg flex-col items-center rounded-lg p-12 py-12 bg-white gap-8">
        <div className="flex flex-col w-full divide-y">
          <div className="flex flex-col gap-12">
            <h1 className="text-xl font-bold self-center text-center">{calculadora.nombre}</h1>
            <div className="w-full flex flex-col gap-4">
              <form id="calculadora" className="flex flex-col gap-8">
                <Calculadora formula={calculadora.formula} parametros={parametros} />
              </form>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold ">Formula</h2>
              <p className="text-sm">{calculadora.formula}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold ">Acerca de {calculadora.nombre}</h2>
              <p className="">{calculadora.descripcion}</p>
            </div>

            <div className="flex flex-col">
              <p className="text-lg font-semibold ">Recomendaciones</p>
              <p className=" ">{calculadora.resultados_recomendaciones}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}