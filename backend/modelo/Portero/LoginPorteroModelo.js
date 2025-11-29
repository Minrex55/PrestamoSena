import db from "../bd/Conexion.js";
import bcrypt from "bcrypt";

class LoginPorteroModelo {
  static async login(correopersonal, contrasena) {
    
    if (!correopersonal || !contrasena) {
        throw new Error('Correo y contraseña son requeridos');
    }

    const query = `SELECT * FROM portero WHERE correopersonal = $1 AND rol = $2`;
    const values = [correopersonal, 'Portero'];
    const resultado = await db.query(query, values);

    if (resultado.rows.length === 0) {
      throw new Error('Credenciales incorrectas');
    }

    const portero = resultado.rows[0];
    const validacion = await bcrypt.compare(contrasena, portero.contrasena);

    if (!validacion) {
      throw new Error('Credenciales incorrectas');
    }

    const { contrasena: _, ...porteroSeguro } = portero;
    return porteroSeguro;
  }
}

export default LoginPorteroModelo;