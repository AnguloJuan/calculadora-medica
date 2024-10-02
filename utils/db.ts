import mysql, { ConnectionOptions } from 'mysql2/promise';

export async function conectarBd() {
    const acceso: ConnectionOptions = ({
        host: 'localhost',
        user: 'root',
        database: 'calculadora',
    });
    const conexionBd = await mysql.createConnection(acceso);
    return conexionBd;
}
