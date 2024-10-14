import { conectarBd } from "@/db/conectarDb";
import { ResultSetHeader } from "mysql2";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface Usuario extends ResultSetHeader {
    usuario: string;
    contrasena: string;
    rol: string;
}

export async function logIn(formData: FormData) {
    const conexion = await conectarBd();
    const usuario = formData.get('usuario');
    let contrasena = formData.get('contrasena');


    if (!usuario || !contrasena) {
        throw new Error('Missing credentials');
    }

    // //encrypt password
    // contrasena = contrasena.toString();
    // const crypto = require('crypto');
    // const hash = crypto.createHash('sha256');
    // hash.update(contrasena);
    // contrasena = hash.digest('hex');


    const [rows, fields] = await conexion.query<Usuario>(
        'SELECT * FROM `usuario` WHERE `usuario` = ? AND `contrasena` = ?',
        [usuario, contrasena]
    );

    if (rows.length === 0) {
        throw new Error('CredentialsSignin');
    }

    const user = rows[0];

    // const encryptedSessionData = encrypt(sessionData) // Encrypt your session data
    cookies().set('rol', user.rol, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/',
    })
}