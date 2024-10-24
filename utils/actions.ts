'use server'

import { ResultSetHeader, RowDataPacket } from "mysql2";
import { redirect } from "next/navigation";
import { conectarBd } from "../db/conectarDb";
import { logIn } from "./auth";
import { Parametro, Unidad, UnidadPorParametro } from "./types";

export async function authenticateAction(_currentState: unknown, formData: FormData) {
    try {
        await logIn(formData)
    } catch (error: any) {
        if (error) {
            switch (error.message) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.'
                default:
                    return 'Something went wrong.'
            }
        }
        throw error
    }
    redirect('/nueva-calculadora')
}

// Calculadoras
export async function crearCalculadoraAction(formulario: FormData) {
    var kebabCase = require('lodash/kebabCase');
    const conexion = await conectarBd();
    const calculadora = {
        nombre: formulario.get('nombre'),
        descripcion: formulario.get('descripcion'),
        descripcion_corta: formulario.get('descripcion_corta'),
        resultados_recomendaciones: formulario.get('resultados_recomendaciones'),
        area: formulario.get('area'),
        enlace: formulario.get('enlace') || null,
        formula: formulario.get('formula'),
        evidencias: JSON.parse(formulario.get('evidencias')?.toString() || '[]') as string[],
        parametros: JSON.parse(formulario.get('parametros')?.toString() || '[]') as Parametro[]
    };

    const enlace = calculadora.enlace || kebabCase(calculadora.nombre);

    if (calculadora.parametros.length === 0) {
        return { error: 'Por favor agregue al menos un parámetro', status: 400 };
    }

    // todo: to convert transaction all queries must be in the same connection

    try {
        const insertCalculadora = await conexion.query<ResultSetHeader>(
            'INSERT INTO `calculadora` (`nombre`, `descripcion`, `descripcion_corta`, `resultados_recomendaciones`, `area`, `formula`, `enlace`) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [calculadora.nombre, calculadora.descripcion, calculadora.descripcion_corta, calculadora.resultados_recomendaciones, calculadora.area, calculadora.formula, enlace]
        );

        if (insertCalculadora[0].affectedRows !== 1) {
            return { error: 'Fallo inesperado guardando la calculadora', status: 500 };
        }

        for (let i = 0; i < calculadora.parametros.length; i++) {
            const insertParametros = await conexion.query<ResultSetHeader>(
                'INSERT INTO `parametros` (`id_calculadora`, `id_parametro`) VALUES (?, ?)',
                [insertCalculadora[0].insertId, calculadora.parametros[i].id]
            );

            if (insertParametros[0].affectedRows !== 1) {
                console.log(insertParametros);
                return { error: 'Fallo inesperado guardando los parametros de la calculadora', status: 500 };
            }
        }

        for (let i = 0; i < calculadora.evidencias.length; i++) {
            const insertEvidencias = await conexion.query<ResultSetHeader>(
                'INSERT INTO `evidencia` (`id_calculadora`, `cita`) VALUES (?, ?)',
                [insertCalculadora[0].insertId, calculadora.evidencias[i]]
            );

            if (insertEvidencias[0].affectedRows !== 1) {
                return { error: 'Fallo inesperado guardando las evidencias de la calculadora', status: 500 };
            }
        }

        return { message: 'Calculadora guardada con exito', enlace: enlace, status: 200 };
    } catch (err) {
        console.log(err);
        return { error: 'Fallo al intentar guardar la calculadora', status: 500 };
    }
}

// Parametros
interface Parametros extends RowDataPacket, Parametro { }
export async function obtenerParametrosAction() {
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
export async function crearParametroAction(formulario: FormData) {
    const conexion = await conectarBd();
    const parametro = {
        nombre: formulario.get('nombre'),
        abreviatura: formulario.get('abreviatura'),
        tipo_campo: formulario.get('tipo_campo'),
        valorMinimo: formulario.get('valorMinimo'),
        valorMaximo: formulario.get('valorMaximo'),
        opciones: formulario.get('opciones')
    };
    const unidades = formulario.get('unidad')

    console.log(1, parametro, unidades);
    

    // try {
    //     let insert;
    //     if (parametro.tipo_campo === 'numerico') {
    //         insert = await conexion.query<ResultSetHeader>(
    //             'INSERT INTO `parametro` (`nombre`, `abreviatura`, `tipo_campo`, `valorMinimo`, `valorMaximo`) VALUES (?, ?, ?, ? , ?)',
    //             [parametro.nombre, parametro.abreviatura, parametro.tipo_campo, parametro.valorMinimo, parametro.valorMaximo]
    //         );
    //     } else {
    //         insert = await conexion.query<ResultSetHeader>(
    //             'INSERT INTO `parametro` (`nombre`, `abreviatura`, `tipo_campo`, `opciones`) VALUES (?, ?, ?, ?)',
    //             [parametro.nombre, parametro.abreviatura, parametro.tipo_campo, parametro.opciones]
    //         );
    //     }

    //     if (insert[0].affectedRows !== 1) {
    //         return { error: 'Fallo inesperado guardando el parámetro', status: 500 };
    //     }

    //     if (unidades) {
    //         for (let i = 0; i < unidades.length; i++) {
    //             const insertUnidades = await conexion.query<ResultSetHeader>(
    //                 'INSERT INTO `parametros_unidades` (`id_parametro`, `id_unidad`) VALUES (?, ?)',
    //                 [insert[0].insertId, unidades[i]]
    //             );

    //             if (insertUnidades[0].affectedRows !== 1) {
    //                 return { error: 'Fallo inesperado guardando las unidades del parámetro', status: 500 };
    //             }
    //         }
    //     }

    //     return { message: 'Parámetro guardado con exito', id: insert[0].insertId, status: 200 };
    // } catch (err) {
    //     console.log(err);
    //     return { error: 'Fallo al intentar guardar el parámetro', status: 500 };
    // }
}
export async function editarParametroAction(formulario: FormData) {
    const conexion = await conectarBd();
    const parametro = {
        id: formulario.get('id'),
        nombre: formulario.get('nombre'),
        abreviatura: formulario.get('abreviatura'),
        tipo_campo: formulario.get('tipo_campo'),
        valorMinimo: formulario.get('valorMinimo'),
        valorMaximo: formulario.get('valorMaximo'),
        opciones: formulario.get('opciones')
    };
    const unidades = formulario.get('unidades')

    try {
        let update;
        if (parametro.tipo_campo === 'numerico') {
            update = await conexion.query<ResultSetHeader>(
                'UPDATE `parametro` SET `nombre` = ?, `abreviatura` = ?, `tipo_campo` = ?, `valorMinimo` = ?, `valorMaximo` = ? WHERE `id` = ?',
                [parametro.nombre, parametro.abreviatura, parametro.tipo_campo, parametro.valorMinimo, parametro.valorMaximo, parametro.id]
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


// Unidades
interface Unidades extends RowDataPacket, Unidad { }
export async function obtenerUnidadesAction() {
    const conexion = await conectarBd();
    try {
        const [unidades] = await conexion.query<Unidades[]>(
            'SELECT * FROM `unidad` ORDER BY `unidad` ASC;'
        );
        // replace unidades with the new ones
        return unidades;
    } catch (err) {
        console.log(err);
        return { error: 'Fallo al intentar obtener las unidades', status: 500 };
    }
}
export async function crearUnidadAction(formulario: FormData) {
    const conexion = await conectarBd();
    const unidad = {
        unidad: formulario.get('unidad'),
        conversion: formulario.get('conversion'),
        id_unidad_conversion: formulario.get('id_unidad_conversion')
    };

    const conversion = unidad.conversion !== '' ? unidad.conversion : null
    const id_unidad_conversion = unidad.id_unidad_conversion !== '0' ? unidad.id_unidad_conversion : null

    try {
        const insert = await conexion.query<ResultSetHeader>(
            'INSERT INTO `unidad` (`unidad`, `conversion`, `id_unidad_conversion`) VALUES (?, ?, ?)',
            [unidad.unidad, conversion, id_unidad_conversion]
        );

        if (insert[0].affectedRows !== 1) {
            return { error: 'Fallo inesperado guardando la unidad', status: 500 };
        }

        return { id: insert[0].insertId, status: 200 };
    } catch (err) {
        console.log(err);
        return { error: 'Fallo al intentar guardar la unidad', status: 500 };
    }
}
export async function obtenerUnidadesPorParametroAction(formulario: FormData) {
    const conexion = await conectarBd();
    const parametroIds = formulario.getAll('parametroIds') || [];
    const query = 'SELECT `unidad` FROM `unidad` JOIN `parametros_unidades` WHERE `id_parametro` = ? ORDER BY `unidad` ASC;'

    if (parametroIds.length === 0) {
        return { error: 'Falta el id del parametro', status: 400 };
    }

    let unidadesPorParametro: UnidadPorParametro[] = [{}] as UnidadPorParametro[];

    try {
        for (let i = 0; i < parametroIds.length; i++) {
            const id = parseInt(parametroIds[i].toString());
            const [unidades] = await conexion.query<Unidades[]>(
                query,
                [id]
            );
            unidadesPorParametro.push({ id_parametro: id, unidades: unidades });
        }

        return unidadesPorParametro;
    } catch (err) {
        console.log(err);
        return { error: 'Fallo al intentar obtener los unidades por parametro', status: 500 };
    }
}