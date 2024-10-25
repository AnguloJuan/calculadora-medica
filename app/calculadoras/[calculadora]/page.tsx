import ListaParametros from "@/app/components/ListaParametros";
import Calcular from "@/app/calculadoras/[calculadora]/Calcular";
import { conectarBd } from "@/db/conectarDb";
import { Calculadora, Parametro } from "@/utils/types";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { RowDataPacket } from "mysql2";

export default async function CalculadoraPage({ params, request }: { params: { calculadora: string }, request: NextRequest }) {
    const conexion = await conectarBd();
    async function obtenerCalculadora() {
        interface RowsCalculadora extends RowDataPacket, Calculadora { }
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

    const calculadora: Calculadora = await obtenerCalculadora();

    async function obtenerParametrosCalculadora() {
        interface Parametros extends RowDataPacket, Parametro { }
        try {
            const [parametrosRows] = await conexion.query<Parametros[]>(
                'SELECT * FROM `parametro` JOIN `parametros` WHERE id_calculadora = ?',
                [calculadora.id]
            );

            if (parametrosRows.length === 0) {
                redirect('/404');
            }

            return parametrosRows;
        } catch (error) {
            console.error(error);
            redirect('/404');
        }
    }

    const parametros: Parametro[] = await obtenerParametrosCalculadora();

    return (
        <div className="flex md:max-w-screen-md lg:max-w-screen-lg flex-col items-center rounded-lg p-12 py-12 bg-white gap-8">
            <h1 className="text-xl font-bold    ">{calculadora.nombre}</h1>
            <div className="w-full flex flex-col gap-4">
                <form id="calculadora">
                    <ListaParametros parametros={parametros} sesion="usuario" />
                    <Calcular formula={calculadora.formula} />
                </form>
            </div>

            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold">Formula</h2>
                <p className="">{calculadora.formula}</p>
            </div>

            <div className="flex flex-col gap-4">
                <p className="text-lg font-semibold">Recomendaciones</p>
                <p className=" ">{calculadora.resultados_recomendaciones}</p>
            </div>
        </div>
    )
}