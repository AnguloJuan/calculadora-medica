import mysql, { ConnectionOptions } from 'mysql2/promise';

let conexionBd: mysql.Connection;
export async function conectarBd() {
    if (!conexionBd) {
        const acceso: ConnectionOptions = ({
            host: 'localhost',
            user: 'root',
            database: 'calculadora_medica',
        });
        conexionBd = await mysql.createConnection(acceso);
    }
    return conexionBd;
}
