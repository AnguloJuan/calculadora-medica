import ListaParametros from "@/app/components/ListaParametros";
import { conectarBd } from "@/db/conectarDb";
import { Calculadora, Parametro } from "@/utils/types";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export default async function CalculadoraPage({ params, request }: { params: { calculadora: string }, request: NextRequest }) {
    const conexion = await conectarBd();
    async function obtenerCalculadora() {
        try {
            const [rows, fields] = await conexion.query('SELECT * FROM calculadora WHERE enlace = ?', [params.calculadora]);

            if (rows.length === 0) {
                redirect('/404');
            }

            return rows[0];
        } catch (error) {
            console.log(error);

            redirect('/404');
        }
    }

    const calculadora: Calculadora = await obtenerCalculadora();

    async function obtenerParametrosCalculadora() {
        try {
            const [parametrosRows, fields] = await conexion.query('SELECT * FROM `parametro` JOIN `parametros` WHERE id_calculadora = ?', [calculadora.id]);


            if (parametrosRows.length === 0) {
                redirect('/404');
            }

            return parametrosRows as Parametro[];
        } catch (error) {
            console.log(error);
            redirect('/404');
        }
    }

    const parametros: Parametro[] = await obtenerParametrosCalculadora();

    return (
        <div className="flex md:max-w-screen-md lg:max-w-screen-lg flex-col items-center rounded-lg p-12 py-12 bg-white gap-8">
            <div className="w-full flex flex-row gap-4">
                <h1>{calculadora.nombre}</h1>
                <ListaParametros parametros={parametros} sesion="usuario" />
            </div>
        </div>
    )
}