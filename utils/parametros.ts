import { conectarBd } from "@/db/conectarDb";
import { RowDataPacket } from "mysql2";
import { Parametro } from "./types";

let parametros: Parametro[] = [];

export default async function ObtenerParametros() {
    if (parametros.length === 0) {
        interface Parametros extends RowDataPacket, Parametro { }

        const conexion = await conectarBd();
        try {
            const [parametros] = await conexion.query<Parametros[]>(
                'SELECT * FROM `parametro` ORDER BY `nombre` ASC;'
            );
            return parametros as Parametro[];
        } catch (err) {
            console.log(err);
            return { error: 'Fallo al intentar obtener los parámetros', status: 500 };
        }
    }
    return parametros;
}