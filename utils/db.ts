// Get the client
import mysql from 'mysql2/promise';

// Create the connection to database
/**
 * @example
 * ```tsx
const connection = await connect();
try {
    const [results] = await connection.query(
        'SELECT * FROM `parametro` WHERE `tipo` LIKE ?',
        ['C%', 10]
    );
    return results;
} catch (err) {
    console.log(err);
}
    ```
 */
export async function connect() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'test',
    });
    return connection;
}
