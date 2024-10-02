'use server'

import { ResultSetHeader } from "mysql2";
import { conectarBd } from "./db";
import { Parametro } from "./types";

interface ParametroResultados extends Parametro, ResultSetHeader {}

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
        tipo: formulario.get('tipo'),
        unidad: formulario.get('unidad'),
        valorMinimo: formulario.get('valorMinimo'),
        valorMaximo: formulario.get('valorMaximo'),
        opciones: formulario.get('opciones')
    };
    try {
        let insert;
        if (parametro.tipo === 'numerico') {
            insert = await conexion.query<ParametroResultados>(
                'INSERT INTO `parametro` (`nombre`, `abreviatura`, `tipo`, `unidad`, `valorMinimo`, `valorMaximo`) VALUES (?, ?, ?, ?, ? , ?)',
                [parametro.nombre, parametro.abreviatura, parametro.tipo, parametro.unidad, parametro.valorMinimo, parametro.valorMaximo]
            );
        } else {
            insert = await conexion.query<ParametroResultados>(
                'INSERT INTO `parametro` (`nombre`, `abreviatura`, `tipo`, `opciones`) VALUES (?, ?, ?, ?)',
                [parametro.nombre, parametro.abreviatura, parametro.tipo, parametro.opciones]
            );
        }

        if (insert[0].affectedRows !== 1) {
            return { error: 'Fallo al guardar el parámetro', status: 500 };
        }
        return { message: 'Parámetro guardado con exito', status: 200, parametro: insert[0] };
    } catch (err) {
        console.log(err);
        return { error: 'Fallo al guardar el parámetro', status: 500 };
    }
}