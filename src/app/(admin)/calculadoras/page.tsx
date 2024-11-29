import { CalculadoraTable, columns } from "@/components/calculadoras/columns";
import CrearCalculadora from "@/components/calculadoras/CrearCalculadora";
import { DataTable } from "@/components/data-table";
import { conectarBd } from "@/db/conectarDb";
import { Calculadora, Parametro, Unidad } from "@/utils/types";
import { TypeCalculadoraSchema } from "@/validationSchemas/CalculadoraSchema";
import { TypeParametroSchema } from "@/validationSchemas/ParametroSchema";
import { RowDataPacket } from "mysql2";

const CalculadorasPage = async () => {
  const conexion = await conectarBd()
  const obtenerCalculadoras = async () => {
    interface Calculadoras extends RowDataPacket, Calculadora { }
    try {
      const [calculadorasRows] = await conexion.query<Calculadoras[]>(
        'SELECT * FROM `calculadora`',
      );

      return calculadorasRows;
    } catch (error) {
      console.error(error);
    }
  }
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

  const calculadoras = await obtenerCalculadoras();
  const parametrosObtenidos = await obtenerParametros();
  const parametros: TypeParametroSchema[] = await obtenerUnidades(parametrosObtenidos!);
  const calculadorasConParametros: TypeCalculadoraSchema[] = calculadoras ? calculadoras.map((calculadora) => {
    return {
      id: calculadora.id,
      nombre: calculadora.nombre,
      descripcion: calculadora.descripcion,
      categoria: calculadora.categoria,
      formula: calculadora.formula,
      parametros: parametros.filter((parametro) => parametro.id === calculadora.id) as [TypeParametroSchema, ...TypeParametroSchema[]],
      evidencias: calculadora.evidencias,
      descripcion_corta: calculadora.descripcion_corta,
      resultados_recomendaciones: calculadora.resultados_recomendaciones,
      enlace: calculadora.enlace,
    }
  }) : []

  const data: CalculadoraTable[] = calculadorasConParametros ? calculadorasConParametros.map((calculadora) => {
    return {
      id: calculadora.id,
      nombre: calculadora.nombre,
      categoria: calculadora.categoria,
      formula: calculadora.formula,
      calculadora: calculadora,
      parametros: parametros,
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