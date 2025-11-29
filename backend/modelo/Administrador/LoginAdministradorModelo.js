import db from "../bd/Conexion.js";
import bcrypt from "bcrypt";

class LoginAdministradorModelo {
    static async login(correopersonal, contrasena) {
    
    if (!correopersonal || !contrasena) {
        throw new Error('Correo y contraseña son requeridos');
    }

    const query = `SELECT * FROM administrador WHERE correopersonal = $1 AND rol = $2`;
    const values = [correopersonal, 'Administrador'];
    const resultado = await db.query(query, values);

    if (resultado.rows.length === 0) {
        throw new Error('Credenciales incorrectas');
    }

    const administrador = resultado.rows[0];
    const validacion = await bcrypt.compare(contrasena, administrador.contrasena);

    if (!validacion) {
        throw new Error('Credenciales incorrectas');
    }

    const {contrasena: _, ...administradorSeguro} = administrador;
    return administradorSeguro;
    }
}

export default LoginAdministradorModelo;