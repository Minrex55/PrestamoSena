import db from "../bd/Conexion.js";
import bcrypt from "bcrypt";

class LoginInvitadoModelo {
    static async login(correopersonal, contrasena) {
    
    if (!correopersonal || !contrasena) {
        throw new Error('Correo y contraseña son requeridos');
    }

    const query = `SELECT * FROM invitado WHERE correopersonal = $1 AND rol = $2`;
    const values = [correopersonal, 'Invitado'];
    const resultado = await db.query(query, values);

    if (resultado.rows.length === 0) {
        throw new Error('Credenciales incorrectas');
    }

    const invitado = resultado.rows[0];
    const validacion = await bcrypt.compare(contrasena, invitado.contrasena);

    if (!validacion) {
        throw new Error('Credenciales incorrectas');
    }

    const {contrasena: _, ...invitadoSeguro} = invitado;
    return invitadoSeguro;
    }
}

export default LoginInvitadoModelo;