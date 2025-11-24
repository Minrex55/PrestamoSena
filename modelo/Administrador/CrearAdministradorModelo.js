import db from '../bd/Conexion.js';
import bcrypt from 'bcrypt';

class CrearAdministradorModelo {
  constructor(documento, nombres, telefono, correopersonal, contrasena) {
    this.documento = documento;
    this.nombres = nombres;
    this.telefono = telefono;
    this.correopersonal = correopersonal;
    this.contrasena = contrasena; 
    this.rol = 'Administrador';
  }

  // Método estático para crear un portero (hashea la contraseña y lo guarda en BD)
  static async crear(documento, nombres, telefono, correopersonal, contrasena, rol) {
    // 1. Hashear la contraseña
    const saltRounds = 10;
    const contrasenaHash = await bcrypt.hash(contrasena, saltRounds);

    // 2. Consulta SQL para insertar
    const query = `
      INSERT INTO administrador (documento, nombres, telefono, correopersonal, contrasena, rol)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [documento, nombres, telefono, correopersonal, contrasenaHash, "Administrador"];

    try {
      const result = await db.query(query, values);
      return result.rows[0]; // Devuelve el Administrador creado (sin la contraseña en texto plano)
    } catch (error) {
      // Si hay un error (ej. correo duplicado, documento duplicado, etc.)
      throw new Error(`Error al crear Administrador: ${error.message}`);
    }
  }
}

export default CrearAdministradorModelo;