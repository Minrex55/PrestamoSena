import db from '../bd/Conexion.js';
import bcrypt from 'bcrypt';

class LoginSuperPorteroModelo {
  // Método estático para autenticar un portero
  static async login(correopersonal, contrasena) {
    // 1. Validar que los parámetros no estén vacíos (opcional, pero recomendado)
    if (!correopersonal || !contrasena) {
      throw new Error('Correo y contraseña son requeridos');
    }

    // 2. Buscar al portero por correo y rol
    const query = 'SELECT * FROM funcionarios WHERE correopersonal = $1 AND rol = $2';
    const values = [correopersonal, 'Superportero'];

    const result = await db.query(query, values);

    // 3. Si no existe, error genérico (seguridad)
    if (result.rows.length === 0) {
      throw new Error('Credenciales incorrectas');
    }

    const superportero = result.rows[0];

    // 4. Comparar la contraseña con el hash almacenado
    const esValida = await bcrypt.compare(contrasena, superportero.contrasena);
    if (!esValida) {
      throw new Error('Credenciales incorrectas');
    }

    // 5. Devolver los datos seguros (sin contraseña)
    const { contrasena: _, ...porteroSeguro } = superportero;
    return porteroSeguro;
  }
}

export default LoginSuperPorteroModelo;