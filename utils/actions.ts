'use server'

import { ResultSetHeader } from "mysql2";
import { conectarBd } from "../db/conectarDb";
import { Parametro } from "./types";

export async function crearCalculadoraAction(formulario: FormData) {
    const conexion = await conectarBd();
    const calculadora = {
        nombre: formulario.get('nombre'),
        descripcion: formulario.get('descripcion'),
        descripcion_corta: formulario.get('descripcion_corta'),
        resultados_recomendaciones: formulario.get('resultados_recomendaciones'),
        area: formulario.get('area'),
        formula: formulario.get('formula'),
        evidencias: formulario.get('evidencias'),
        parametros: JSON.parse(formulario.get('parametros')?.toString() || '[]') as Parametro[]
    };

    if (calculadora.parametros.length === 0) {
        return { error: 'Por favor agregue al menos un parámetro', status: 400 };
    }

    try {
        const insertCalculadora = await conexion.query<ResultSetHeader>(
            'INSERT INTO `calculadora` (`nombre`, `descripcion`, `descripcion_corta`, `resultados_recomendaciones`, `area`, `formula`, `evidencias`) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [calculadora.nombre, calculadora.descripcion, calculadora.descripcion_corta, calculadora.resultados_recomendaciones, calculadora.area, calculadora.formula, calculadora.evidencias]
        );
        
        if (insertCalculadora[0].affectedRows !== 1) {
            return { error: 'Fallo inesperado guardando la calculadora', status: 500 };
        }

        let insertParametros;

        for (let i = 0; i < calculadora.parametros.length; i++) {
            insertParametros = await conexion.query<ResultSetHeader>(
                'INSERT INTO `parametros` (`id_calculadora`, `id_parametro`) VALUES (?, ?)',
                [insertCalculadora[0].insertId, calculadora.parametros[i].id]
            );

            if (insertParametros[0].affectedRows !== 1) {
                console.log(insertParametros);
                return { error: 'Fallo inesperado guardando los parametros de la calculadora', status: 500 };
            }
        }

        return { message: 'Calculadora guardada con exito', id: insertCalculadora[0].insertId, status: 200 };
    } catch (err) {
        console.log(err);
        return { error: 'Fallo al intentar guardar la calculadora', status: 500 };
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

export async function editarParametroAction(formulario: FormData) {
    const conexion = await conectarBd();
    const parametro = {
        id: formulario.get('id'),
        nombre: formulario.get('nombre'),
        abreviatura: formulario.get('abreviatura'),
        tipo_campo: formulario.get('tipo_campo'),
        unidad_metrica: formulario.get('unidad_metrica'),
        valorMinimo: formulario.get('valorMinimo'),
        valorMaximo: formulario.get('valorMaximo'),
        opciones: formulario.get('opciones')
    };

    try {
        let update;
        if (parametro.tipo_campo === 'numerico') {
            update = await conexion.query<ResultSetHeader>(
                'UPDATE `parametro` SET `nombre` = ?, `abreviatura` = ?, `tipo_campo` = ?, `unidad_metrica` = ?, `valorMinimo` = ?, `valorMaximo` = ? WHERE `id` = ?',
                [parametro.nombre, parametro.abreviatura, parametro.tipo_campo, parametro.unidad_metrica, parametro.valorMinimo, parametro.valorMaximo, parametro.id]
            );
        } else {
            update = await conexion.query<ResultSetHeader>(
                'UPDATE `parametro` SET `nombre` = ?, `abreviatura` = ?, `tipo_campo` = ?, `opciones` = ? WHERE `id` = ?',
                [parametro.nombre, parametro.abreviatura, parametro.tipo_campo, parametro.opciones, parametro.id]
            );
        }

        if (update[0].affectedRows !== 1) {
            return { error: 'Fallo inesperado actualizando el parámetro', status: 500 };
        }

        return { message: 'Parámetro actualizado con exito', status: 200 };
    } catch (err) {
        console.log(err);
        return { error: 'Fallo al intentar actualizar el parámetro', status: 500 };
    }
}

// export async function obtenerParametros() {
//     interface Parametros extends RowDataPacket, Parametro { }

//     const conexion = await conectarBd();
//     try {
//         const [parametros] = await conexion.query<Parametros[]>(
//             'SELECT * FROM `parametro` ORDER BY `nombre` ASC;'
//         );
//         return parametros;
//     } catch (err) {
//         console.log(err);
//         return { error: 'Fallo al intentar obtener los parámetros', status: 500 };
//     }
// }