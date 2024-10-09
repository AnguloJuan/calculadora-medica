'use server'

import { ResultSetHeader, RowDataPacket } from "mysql2";
import { conectarBd } from "../db/conectarDb";
import { Parametro } from "./types";

export async function crearCalculadoraAction(formulario: FormData) {
    const conexion = await conectarBd();
    try {
        await conexion.query(
            'INSERT INTO `calculadora` (`nombre`, `descripcion`, `parametros`, `formula`) VALUES (?, ?, ?, ?)',
            [formulario.get('nombre'), formulario.get('descripcion'), formulario.get('parametros'), formulario.get('formula')]
        );
    } catch (err) {
        console.log(err);
    }
}

export async function crearParametroAction(formulario: FormData) {
    const conexion = await conectarBd();
    const parametro = {
        nombre: formulario.get('nombre'),
        abreviatura: formulario.get('abreviatura'),
        tipo_campo: formulario.get('tipo_campo'),
        unidad_metrica: formulario.get('unidad_metrica'),
        valorMinimo: formulario.get('valorMinimo'),
        valorMaximo: formulario.get('valorMaximo'),
        opciones: formulario.get('opciones')
    };
    try {
        let insert;
        if (parametro.tipo_campo === 'numerico') {
            insert = await conexion.query<ResultSetHeader>(
                'INSERT INTO `parametro` (`nombre`, `abreviatura`, `tipo_campo`, `unidad_metrica`, `valorMinimo`, `valorMaximo`) VALUES (?, ?, ?, ?, ? , ?)',
                [parametro.nombre, parametro.abreviatura, parametro.tipo_campo, parametro.unidad_metrica, parametro.valorMinimo, parametro.valorMaximo]
            );
        } else {
            insert = await conexion.query<ResultSetHeader>(
                'INSERT INTO `parametro` (`nombre`, `abreviatura`, `tipo_campo`, `opciones`) VALUES (?, ?, ?, ?)',
                [parametro.nombre, parametro.abreviatura, parametro.tipo_campo, parametro.opciones]
            );
        }

        if (insert[0].affectedRows !== 1) {
            return { error: 'Fallo inesperado guardando el parámetro', status: 500 };
        }

        return { message: 'Parámetro guardado con exito', id: insert[0].insertId, status: 200 };
    } catch (err) {
        console.log(err);
        return { error: 'Fallo al intentar guardar el parámetro', status: 500 };
    }
}

export async function obtenerParametros() {
    interface Parametros extends RowDataPacket, Parametro { }

    const conexion = await conectarBd();
    try {
        const [parametros] = await conexion.query<Parametros[]>(
            'SELECT * FROM `parametro` ORDER BY `nombre` ASC;'
        );
        return parametros;
    } catch (err) {
        console.log(err);
        return { error: 'Fallo al intentar obtener los parámetros', status: 500 };
    }
}