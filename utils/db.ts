// Get the client
import mysql from 'mysql2/promise';

// Create the connection to database
export async function connect() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'test',
    });
    return connection;
}

// example
/*
const connection = await connect();
  try {
      const [results] = await connection.query(
          'SELECT * FROM `sessions` WHERE `name` LIKE ? AND `max_capacity` > ?',
          ['C%', 10]
      );

      console.log(results);
  } catch (err) {
      console.log(err);
  }
*/