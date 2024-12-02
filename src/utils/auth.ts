import { conectarBd } from "@/db/conectarDb";
import bcrypt from 'bcrypt';
import { ResultSetHeader } from "mysql2";
import { createSession } from "./sessions";

interface Usuario extends ResultSetHeader {
  id: number;
  usuario: string;
  contrasena: string;
  rol: string;
}

export async function logIn(formData: FormData) {
  const conexion = await conectarBd();
  const usuario = formData.get('usuario');
  let contrasena = formData.get('contrasena');

  if (!usuario || !contrasena) {
    throw new Error('MissingCredentials');
  }

  // Fetch the user's hashed password from the database
  const [user] = await conexion.execute<Usuario[]>(
    'SELECT * FROM usuario WHERE usuario = ?',
    [usuario]
  );

  if (user.length === 0) {
    throw new Error('CredentialsSignin');
  }

  const hashedPassword = user[0].contrasena;

  // Compare the entered password with the stored hash
  const isMatch = await bcrypt.compare(contrasena, hashedPassword);

  if (isMatch) {
    await createSession(user[0].rol);
  } else {
    throw new Error('CredentialsSignin');
  }
}

const saltRounds = 10; // Adjust as needed for performance vs security

export async function signUp(formData: FormData) {
  const usuario = formData.get('usuario');
  let contrasena = formData.get('contrasena');
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

    // Save the hashed password in the database
    const conexion = await conectarBd();

    const query = 'INSERT INTO usuario (usuario, contrasena) VALUES (?, ?)';
    await conexion.execute(query, [usuario, hashedPassword]);
    return true;
  } catch (error) {
    console.error(error);
    throw new Error('ErrorRegistering');
  }
}
