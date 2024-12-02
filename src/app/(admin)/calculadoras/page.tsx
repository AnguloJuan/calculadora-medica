import { CalculadoraTable, columns } from "@/components/calculadoras/columns";
import CrearCalculadora from "@/components/calculadoras/CrearCalculadora";
import { DataTable } from "@/components/data-table";
import { conectarBd } from "@/db/conectarDb";
import { Calculadora, Evidencia, Parametro, Unidad } from "@/utils/types";
import { TypeCalculadoraSchema } from "@/validationSchemas/CalculadoraSchema";
import { TypeParametroSchema } from "@/validationSchemas/ParametroSchema";
import { RowDataPacket } from "mysql2";

const CalculadorasPage = async () => {
  const conexion = await conectarBd()

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

  // Obtener calculadoras con evidencias y parametros
  async function obtenerCalculadoras() {
    interface RowsCalculadora extends RowDataPacket, Calculadora { }
    interface Evidencias extends RowDataPacket, Evidencia { }

    try {
      const [calcRows] = await conexion.query<RowsCalculadora[]>('SELECT * FROM calculadora');
      const [evidencieaRows] = await conexion.query<Evidencias[]>('SELECT * FROM evidencia');
      const [relations] = await conexion.query<RowDataPacket[]>('SELECT * FROM `calculadora_parametro`');
      
      const calculadorasConParametros = calcRows.map((calculadora) => {
        return {
          ...calculadora,
          parametros: parametros.filter((parametro) => relations.some((relation) => relation.id_calculadora === calculadora.id && relation.id_parametro === parametro.id)) as any,
        }
      });

      const calculadoras = calculadorasConParametros.map((calc) => {
        return {
          ...calc,
          evidencias: (evidencieaRows.filter((evidencia) => evidencia.id_calculadora === calc.id).map((evidencia) => ({
            id: evidencia.id,
            enlace: evidencia.enlace,
            cita: evidencia.cita,
            id_calculadora: evidencia.id_calculadora
          })) as [ Evidencia , ...Evidencia[]])
        }
      });

      return calculadoras
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const calculadoras: TypeCalculadoraSchema[] = await obtenerCalculadoras();

  const data: CalculadoraTable[] = calculadoras ? calculadoras.map((calculadora) => {
    return {
      id: calculadora.id,
      nombre: calculadora.nombre,
      categoria: calculadora.categoria,
      formula: calculadora.formula,
      calculadora: calculadora,
      parametros: calculadora.parametros.length > 0 ? calculadora.parametros : [] as any,
    }
  }) : []

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
          <div className="container mx-auto">
            <DataTable columns={columns} data={data} />
          </div>
        </div>
      </div>
    </main>
  </>)
}

export default CalculadorasPage