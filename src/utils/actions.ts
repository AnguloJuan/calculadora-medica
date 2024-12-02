'use server'

import { ResultSetHeader, RowDataPacket } from "mysql2";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { conectarBd } from "../db/conectarDb";
import { logIn, signUp } from "./auth";
import { ActualizarParametros } from "./constantes";
import { deleteSession } from "./sessions";
import { Parametro, Unidad, UnidadPorParametro } from "./types";
import EvidenciaSchema from "@/validationSchemas/EvidenciaSchema";
import { z } from "@/lib/es-zod";

// Auth
export async function authenticateAction(_currentState: unknown, formData: FormData) {
  try {
    await logIn(formData)
  } catch (error: any) {
    if (error) {
      console.error(error);

      switch (error.message) {
        case 'CredentialsSignin':
          return 'Credenciales invalidas.'
        case 'MissingCredentials':
          return 'Por favor llene todos los campos.'
        default:
          return 'Algo salio mal.'
      }
    }
    throw error
  }
  if (cookies().has('session')) {
    redirect('/calculadoras');
  }
}
export async function signUpAction(_currentState: unknown, formData: FormData) {
  try {
    const success = await signUp(formData)
    return success && 'Usuario registrado con exito'
  } catch (error: any) {
    if (error.message === 'ErrorRegistering') {
      return 'Error al registrar el usuario'
    }
    throw error
  }
}

export async function cerrarSesionAction() {
  await deleteSession();
  redirect('/iniciar-sesion');
}

type EvidenciaSchema = z.infer<typeof EvidenciaSchema>;
// Calculadoras
export async function crearCalculadoraAction(formulario: FormData) {
  var kebabCase = require('lodash/kebabCase');
  const conexion = await conectarBd();
  const calculadora = {
    nombre: formulario.get('nombre'),
    descripcion: formulario.get('descripcion'),
    descripcion_corta: formulario.get('descripcion_corta'),
    resultados_recomendaciones: formulario.get('resultados_recomendaciones'),
    categoria: formulario.get('categoria'),
    enlace: formulario.get('enlace') || null,
    formula: formulario.get('formula'),
    evidencias: JSON.parse(formulario.get('evidencias')?.toString() || '[]') as EvidenciaSchema[],
    parametros: JSON.parse(formulario.get('parametros')?.toString() || '[]') as Parametro[]
  };

  const enlace = calculadora.enlace !== "" ? kebabCase(calculadora.enlace) : kebabCase(calculadora.nombre);

  if (calculadora.parametros.length === 0) {
    return { error: 'Por favor agregue al menos un parámetro', status: 400 };
  }

  // todo: to convert transaction all queries must be in the same connection

  try {
    const insertCalculadora = await conexion.query<ResultSetHeader>(
      'INSERT INTO `calculadora` (`nombre`, `descripcion`, `descripcion_corta`, `resultados_recomendaciones`, `categoria`, `formula`, `enlace`) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [calculadora.nombre, calculadora.descripcion, calculadora.descripcion_corta, calculadora.resultados_recomendaciones, calculadora.categoria, calculadora.formula, enlace]
    );

    if (insertCalculadora[0].affectedRows !== 1) {
      return { error: 'Fallo inesperado guardando la calculadora', status: 500 };
    }

    for (let i = 0; i < calculadora.parametros.length; i++) {
      const insertParametros = await conexion.query<ResultSetHeader>(
        'INSERT INTO `calculadora_parametro` (`id_calculadora`, `id_parametro`) VALUES (?, ?)',
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
        [insertCalculadora[0].insertId, calculadora.evidencias[i].cita]
      );

      if (insertEvidencias[0].affectedRows !== 1) {
        return { error: 'Fallo inesperado guardando las evidencias de la calculadora', status: 500 };
      }
    }

    return { message: 'Calculadora guardada con exito', enlace: enlace, status: 200 };
  } catch (err) {
    console.error(err);
    return { error: 'Fallo al intentar guardar la calculadora', status: 500 };
  }
}
export async function eliminarCalculadoraAction(formulario: FormData) {
  const conexion = await conectarBd();
  const id = formulario.get('id');

  try {
    const deleteRelaciones = await conexion.query<ResultSetHeader>(
      'DELETE FROM `calculadora_parametro` WHERE `id_calculadora` = ?',
      [id]
    );
    const deleteEvidencias = await conexion.query<ResultSetHeader>(
      'DELETE FROM `evidencia` WHERE `id_calculadora` = ?',
      [id]
    );
    const deleteCalculadora = await conexion.query<ResultSetHeader>(
      'DELETE FROM `calculadora` WHERE `id` = ?',
      [id]
    );

    if (deleteCalculadora[0].affectedRows !== 1) {
      return { error: 'Error al eliminar la calculadora', status: 500 };
    }

    return { status: 200 };
  } catch (err) {
    console.error(err);
    return { error: 'Error al eliminar la calculadora', status: 500 };
  }
}
export async function actualizarCalculadoraAction(formulario: FormData) {
  const conexion = await conectarBd();
  const calculadora = {
    id: formulario.get('id'),
    nombre: formulario.get('nombre'),
    descripcion: formulario.get('descripcion'),
    descripcion_corta: formulario.get('descripcion_corta'),
    resultados_recomendaciones: formulario.get('resultados_recomendaciones'),
    categoria: formulario.get('categoria'),
    enlace: formulario.get('enlace') || null,
    formula: formulario.get('formula'),
    evidencias: JSON.parse(formulario.get('evidencias')?.toString() || '[]') as EvidenciaSchema[],
    parametros: JSON.parse(formulario.get('parametros')?.toString() || '[]') as Parametro[]
  };

  var kebabCase = require('lodash/kebabCase');
  const enlace = calculadora.enlace !== "" ? kebabCase(calculadora.enlace) : kebabCase(calculadora.nombre);

  if (calculadora.parametros.length === 0) {
    return { error: 'Por favor agregue al menos un parámetro', status: 400 };
  }

  try {
    const updateCalculadora = await conexion.query<ResultSetHeader>(
      'UPDATE `calculadora` SET `nombre` = ?, `descripcion` = ?, `descripcion_corta` = ?, `resultados_recomendaciones` = ?, `categoria` = ?, `formula` = ?, `enlace` = ? WHERE `id` = ?',
      [calculadora.nombre, calculadora.descripcion, calculadora.descripcion_corta, calculadora.resultados_recomendaciones, calculadora.categoria, calculadora.formula, enlace, calculadora.id]
    );

    if (updateCalculadora[0].affectedRows !== 1) {
      return { error: 'Error al actualizar la calculadora', status: 500 };
    }

    // insert new parameters if any
    for (let i = 0; i < calculadora.parametros.length; i++) {
      await conexion.query<ResultSetHeader>(
        'INSERT IGNORE INTO `calculadora_parametro` (`id_calculadora`, `id_parametro`) VALUES (?, ?)',
        [calculadora.id, calculadora.parametros[i].id]
      );
    }
    // delete all the parameters that are not in the new list
    await conexion.query<ResultSetHeader>(
      'DELETE FROM `calculadora_parametro` WHERE `id_calculadora` = ? AND `id_parametro` NOT IN (?)',
      [calculadora.id, calculadora.parametros.map((parametro) => parametro.id)]
    );

    // insert new evidences if any
    for (let i = 0; i < calculadora.evidencias.length; i++) {
      await conexion.query<ResultSetHeader>(
        'INSERT IGNORE INTO `evidencia` (`id_calculadora`, `cita`) VALUES (?, ?)',
        [calculadora.id, calculadora.evidencias[i].cita]
      );
    }
    // delete all the evidences that are not in the new list
    await conexion.query<ResultSetHeader>(
      'DELETE FROM `evidencia` WHERE `id_calculadora` = ? AND `cita` NOT IN (?)',
      [calculadora.id, calculadora.evidencias.map((evidencia) => evidencia.cita)]
    );

    return { status: 200 };
  } catch (err) {
    console.error(err);
    return { error: 'Error al actualizar la calculadora', status: 500 };
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
    console.error(err);
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
  const unidades = JSON.parse(formulario.get('unidades')?.toString() || '[]') as Unidad[]

  try {
    let insertParametro;
    if (parametro.tipo_campo === 'numerico') {
      insertParametro = await conexion.query<ResultSetHeader>(
        'INSERT INTO `parametro` (`nombre`, `abreviatura`, `tipo_campo`, `valorMinimo`, `valorMaximo`) VALUES (?, ?, ?, ? , ?)',
        [parametro.nombre, parametro.abreviatura, parametro.tipo_campo, parametro.valorMinimo !== '' ? parametro.valorMinimo : null, parametro.valorMaximo !== '' ? parametro.valorMaximo : null]
      );
    } else {
      insertParametro = await conexion.query<ResultSetHeader>(
        'INSERT INTO `parametro` (`nombre`, `abreviatura`, `tipo_campo`, `opciones`) VALUES (?, ?, ?, ?)',
        [parametro.nombre, parametro.abreviatura, parametro.tipo_campo, parametro.opciones]
      );
    }

    if (insertParametro[0].affectedRows !== 1) {
      return { error: 'Fallo inesperado guardando el parámetro', status: 500 };
    }

    let insertUnidades;
    if (unidades) {
      for (let i = 0; i < unidades.length; i++) {
        const insertUnidades = await conexion.query<ResultSetHeader>(
          'INSERT INTO `parametro_unidad` (`id_parametro`, `id_unidad`) VALUES (?, ?)',
          [insertParametro[0].insertId, unidades[i].id]
        );

        if (insertUnidades[0].affectedRows !== 1) {
          return { error: 'Fallo inesperado guardando las unidades del parámetro', status: 500 };
        }
      }
    }

    return { message: 'Parámetro guardado con exito', id: insertParametro[0].insertId, status: 200 };
  } catch (err) {
    console.error(err);
    return { error: 'Fallo al intentar guardar el parámetro', status: 500 };
  }
}
export async function actualizarParametroAction(formulario: FormData) {
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
  const unidades = JSON.parse(formulario.get('unidades')?.toString() || '[]') as Unidad[]

  try {
    let update;
    if (parametro.tipo_campo === 'numerico') {
      update = await conexion.query<ResultSetHeader>(
        'UPDATE `parametro` SET `nombre` = ?, `abreviatura` = ?, `tipo_campo` = ?, `valorMinimo` = ?, `valorMaximo` = ? WHERE `id` = ?',
        [parametro.nombre, parametro.abreviatura, parametro.tipo_campo, parametro.valorMinimo !== '' ? parametro.valorMinimo : null, parametro.valorMaximo !== '' ? parametro.valorMaximo : null, parametro.id]
      );
    } else {
      update = await conexion.query<ResultSetHeader>(
        'UPDATE `parametro` SET `nombre` = ?, `abreviatura` = ?, `tipo_campo` = ?, `opciones` = ? WHERE `id` = ?',
        [parametro.nombre, parametro.abreviatura, parametro.tipo_campo, parametro.opciones, parametro.id]
      );
    }

    if (update[0].affectedRows !== 1) {
      console.error(update);
      return { error: 'Fallo inesperado actualizando el parámetro', status: 500 };
    }

    // insert new units if any
    if (parametro.tipo_campo === 'numerico' && unidades) {
      for (let i = 0; i < unidades.length; i++) {
        await conexion.query<ResultSetHeader>(
          'INSERT IGNORE INTO `parametro_unidad` (`id_parametro`, `id_unidad`) VALUES (?, ?)',
          [parametro.id, unidades[i].id]
        );
      }
      // delete all the units that are not in the new list
      await conexion.query<ResultSetHeader>(
        'DELETE FROM `parametro_unidad` WHERE `id_parametro` = ? AND `id_unidad` NOT IN (?)',
        [parametro.id, unidades.map((unidad) => unidad.id)]
      );
    }

    return { message: 'Parámetro actualizado con exito', status: 200 };
  } catch (err) {
    console.error(err);
    return { error: 'Fallo al intentar actualizar el parámetro', status: 500 };
  }
}
export async function actualizarParametrosServidorAction() {
  ActualizarParametros();
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
    return unidades as Unidad[];
  } catch (err) {
    console.error(err);
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
  const id_unidad_conversion = (unidad.id_unidad_conversion !== '' && unidad.id_unidad_conversion !== '0') ? unidad.id_unidad_conversion : null

  // check if the unit already exists
  const [unidades] = await conexion.query<Unidades[]>(
    'SELECT * FROM `unidad` WHERE `unidad` = ?',
    [unidad.unidad]
  );

  if (unidades.length > 0) {
    return { error: 'La unidad ya existe', status: 400 };
  }

  try {
    const insert = await conexion.query<ResultSetHeader>(
      'INSERT INTO `unidad` (`unidad`, `conversion`, `id_unidad_conversion`) VALUES (?, ?, ?)',
      [unidad.unidad, conversion, id_unidad_conversion]
    );

    if (insert[0].affectedRows !== 1) {
      return { error: 'Error al crear la unidad', status: 500 };
    }

    return { id: insert[0].insertId, status: 200 };
  } catch (err) {
    console.error(err);
    return { error: 'Error al crear la unidad', status: 500 };
  }
}
export async function obtenerUnidadesPorParametroAction(formulario: FormData) {
  const conexion = await conectarBd();
  const parametroIds = formulario.getAll('parametroIds') || [];

  if (parametroIds.length === 0) {
    return { error: 'Falta el id del parametro', status: 400 };
  }

  let unidadesPorParametro = [] as UnidadPorParametro[];

  try {
    for (let i = 0; i < parametroIds.length; i++) {
      const id = parseInt(parametroIds[i].toString());
      const [unidades] = await conexion.query<Unidades[]>(
        'SELECT * FROM `parametro_unidad` as `pu` RIGHT JOIN `unidad` as `u` ON pu.id_unidad = u.id AND `id_parametro` = ? WHERE pu.id IS NOT NULL;',
        [id]
      );

      unidadesPorParametro.push({ id_parametro: id, unidades: unidades });
    }

    return unidadesPorParametro;
  } catch (err) {
    console.error(err);
    return { error: 'Fallo al intentar obtener los unidades por parametro', status: 500 };
  }
}

// Evidencias TODO
// interface Evidencias extends RowDataPacket {
//   id: number;
//   cita: string;
// }
// export async function obtenerEvidenciasAction() {
//   const conexion = await conectarBd();
//   try {
//     const [evidencias] = await conexion.query<Evidencias[]>(
//       'SELECT * FROM `evidencia` ORDER BY `cita` ASC;'
//     );
//     return evidencias;
//   } catch (err) {
//     console.error(err);
//     return { error: 'Fallo al intentar obtener las evidencias', status: 500 };
//   }
// }
// export async function crearEvidenciaAction(formulario: FormData) {
//   const conexion = await conectarBd();
//   const evidencia = {
//     cita: formulario.get('cita')
//   };

//   try {
//     const insert = await conexion.query<ResultSetHeader>(
//       'INSERT INTO `evidencia` (`cita`) VALUES (?)',
//       [evidencia.cita]
//     );

//     if (insert[0].affectedRows !== 1) {
//       return { error: 'Error al crear la evidencia', status: 500 };
//     }

//     return { id: insert[0].insertId, status: 200 };
//   } catch (err) {
//     console.error(err);
//     return { error: 'Error al crear la evidencia', status: 500 };
//   }
// }
// export async function actualizarEvidenciaAction(formulario: FormData) {
//   const conexion = await conectarBd();
//   const evidencia = {
//     id: formulario.get('id'),
//     cita: formulario.get('cita')
//   };

//   try {
//     const update = await conexion.query<ResultSetHeader>(
//       'UPDATE `evidencia` SET `cita` = ? WHERE `id` = ?',
//       [evidencia.cita, evidencia.id]
//     );

//     if (update[0].affectedRows !== 1) {
//       return { error: 'Error al actualizar la evidencia', status: 500 };
//     }

//     return { status: 200 };
//   } catch (err) {
//     console.error(err);
//     return { error: 'Error al actualizar la evidencia', status: 500 };
//   }
// }
// export async function eliminarEvidenciaAction(formulario: FormData) {
//   const conexion = await conectarBd();
//   const id = formulario.get('id');

//   try {
//     const deleteEvidencia = await conexion.query<ResultSetHeader>(
//       'DELETE FROM `evidencia` WHERE `id` = ?',
//       [id]
//     );

//     if (deleteEvidencia[0].affectedRows !== 1) {
//       return { error: 'Error al eliminar la evidencia', status: 500 };
//     }

//     return { status: 200 };
//   } catch (err) {
//     console.error(err);
//     return { error: 'Error al eliminar la evidencia', status: 500 };
//   }
// }