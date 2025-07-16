
import CalculadoraComponent from "@/components/calculadoras/Calculadora";
import CalculadoraInfo from "@/components/calculadoras/CalculadoraInfo";
import { Each } from "@/components/EachOf";
import ReadOnlyRichText from "@/components/slatejs/read-only";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { conectarBd } from "@/db/conectarDb";
import { Calculadora, Evidencia, Parametro, Unidad } from "@/utils/types";
import { TypeParametroSchema } from "@/validationSchemas/ParametroSchema";
import { FileText } from "lucide-react";
import { RowDataPacket } from "mysql2";
import Link from "next/link";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

interface RowsCalculadora extends RowDataPacket, Calculadora { }
interface Parametros extends RowDataPacket, Parametro { }
interface Unidades extends RowDataPacket, Unidad { }
type IParametro = TypeParametroSchema & {
  unidadActual?: Unidad;
}

interface Evidencias extends RowDataPacket, Evidencia { }

export default async function CalculadoraPage({ params }: { params: { categoria: string, calculadora: string } }) {
  const conexion = await conectarBd();
  async function obtenerCalculadora() {
    try {
      const [rows] = await conexion.query<RowsCalculadora[]>('SELECT * FROM calculadora WHERE categoria = ? AND enlace = ?', [params.categoria, params.calculadora]);

      if (rows.length === 0) {
        redirect('/404');
      }

      return rows[0];
    } catch (error) {
      console.error(error);
      redirect('/404');
    }
  }
  const calculadora: Calculadora = await obtenerCalculadora();

  async function obtenerParametros() {
    try {
      const [parametrosRows] = await conexion.query<Parametros[]>(
        'SELECT * FROM `calculadora_parametro` as `cp` RIGHT JOIN `parametro` as `p` ON cp.id_parametro = p.id WHERE id_calculadora = ?',
        [calculadora.id]
      );

      if (parametrosRows.length === 0) {
        console.error('No se encontraron parametros');
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

  async function obtenerEvidencias() {
    try {
      const [rows] = await conexion.query<Evidencias[]>('SELECT * FROM `evidencia` WHERE id_calculadora = ?', [calculadora.id]);

      return rows;
    } catch (error) {
      console.error(error);
      redirect('/404');
    }
  }
  const evidencias: Evidencia[] = await obtenerEvidencias();


  return (
    <main className="w-full flex flex-col items-center rounded-lg pt-12 md:p-12 bg-background gap-8">
      <h2 className="border-b pb-2 text-2xl sm:text-3xl font-semibold tracking-tight text-center">
        {calculadora.nombre}
      </h2>
      <div className="flex flex-col gap-6 md:flex-row divide-y">
        <CalculadoraComponent formula={calculadora.formula} parametros={parametros} unidad_resultado={calculadora.unidad_resultado} />
        <CalculadoraInfo calculadora={calculadora} evidencias={evidencias} />
      </div>
    </main>
  )
}