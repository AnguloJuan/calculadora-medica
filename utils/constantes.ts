/**
 * Las funciones solo deben ser llamados desde servidor
 */
import { conectarBd } from "@/db/conectarDb";
import { RowDataPacket } from "mysql2";
import { Parametro, Unidad } from "./types";

const PARAMETROS: Parametro[] = [];
const UNIDADES: Unidad[] = [];

async function ActualizarParametros() {
    if (PARAMETROS.length === 0) {
        interface Parametros extends RowDataPacket, Parametro { }

        const conexion = await conectarBd();
        try {
            const [parametros] = await conexion.query<Parametros[]>(
                'SELECT * FROM `parametro` ORDER BY `nombre` ASC;'
            );
            // replace parametros with the new ones
            PARAMETROS.splice(0, PARAMETROS.length, ...parametros);
        } catch (err) {
            console.log(err);
            return { error: 'Fallo al intentar obtener los parámetros', status: 500 };
        }
    }
}

async function ActualizarUnidades() {
    if (UNIDADES.length === 0) {
        interface Unidades extends RowDataPacket, Unidad { }

        const conexion = await conectarBd();
        try {
            const [unidades] = await conexion.query<Unidades[]>(
                'SELECT * FROM `unidad` ORDER BY `unidad` ASC;'
            );
            // replace unidades with the new ones
            UNIDADES.splice(0, UNIDADES.length, ...unidades);
        } catch (err) {
            console.log(err);
            return { error: 'Fallo al intentar obtener las unidades', status: 500 };
        }
    }
}

ActualizarParametros();
ActualizarUnidades();

export { PARAMETROS, UNIDADES, ActualizarParametros, ActualizarUnidades };