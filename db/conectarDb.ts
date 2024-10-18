import mysql, { ConnectionOptions } from 'mysql2/promise';

let conexionBd: mysql.Connection;
export async function conectarBd() {
    if (!conexionBd) {
        try {
            const acceso: ConnectionOptions = ({
                host: 'localhost',
                user: 'root',
                database: 'calculadora_medica',
            });
            conexionBd = await mysql.createConnection(acceso);
        } catch (error) {
            console.error('Error al conectar a la base de datos', error);
        }
    }
    return conexionBd;
}