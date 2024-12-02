
import CalculadoraComponent from "@/components/Calculadora";
import { Each } from "@/components/EachOf";
import ReadOnlyText from "@/components/slatejs/read-only";
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

export default async function CalculadoraPage({ params, request }: { params: { categoria: string, calculadora: string }, request: NextRequest }) {
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
    <div className="w-full bg-background flex flex-col items-center">
      <main className="flex md:max-w-screen-md lg:max-w-screen-lg flex-col items-center rounded-lg p-12 py-12 bg-background gap-8">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          {calculadora.nombre}
        </h2>
        <div className="flex flex-col gap-8 sm:flex sm:flex-row gap-y-8 divide-y gap-x-8">
          <div className="flex flex-col">
            <div className="flex flex-col gap-4">
              <CalculadoraComponent formula={calculadora.formula} parametros={parametros} />
            </div>
          </div>

          <Tabs defaultValue="Formula" className="w-[400px] lg:w-[650px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="Formula">Formula</TabsTrigger>
              <TabsTrigger value="Recomendaciones">Recomendaciones</TabsTrigger>
              <TabsTrigger value="Evidencias">Evidencias</TabsTrigger>
            </TabsList>

            <TabsContent value="Formula">
              <Card className="bg-container">
                <CardHeader>
                  <CardTitle>Formula</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{calculadora.formula_display ? calculadora.formula_display : calculadora.formula}</p>
                </CardContent>
                <CardHeader>
                  <CardTitle>Acerca de {calculadora.nombre}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReadOnlyText value={calculadora.descripcion} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="Recomendaciones">
              <Card className="bg-container">
                <CardHeader>
                  <CardTitle>Resultados y Recomendaciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReadOnlyText value={calculadora.resultados_recomendaciones} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="Evidencias">
              <Card className="bg-container">
                <CardHeader>
                  <CardTitle>Evidencias</CardTitle>
                </CardHeader>
                <CardContent>
                  <Each of={evidencias} render={
                    (evidencia, index) => (<>
                      {evidencia.enlace ?
                        <a href={evidencia.enlace} target="_blank">
                          <Card key={index} className="w-full py-4 ps-4 pe-0">
                            <CardContent className="p-0 flex flex-row gap-2">
                              <FileText className="min-w-6 min-h-6" />
                              <p className="text-sm text-muted-foreground">{evidencia.cita}</p>
                            </CardContent>
                          </Card>
                        </a> :
                        <Card key={index} className="w-full py-4 ps-4 pe-0">
                          <CardContent className="p-0 flex flex-row gap-2">
                            <FileText className="min-w-6 min-h-6" />
                            <p className="text-sm text-muted-foreground">{evidencia.cita}</p>
                          </CardContent>
                        </Card>
                      }

                    </>)
                  } />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}