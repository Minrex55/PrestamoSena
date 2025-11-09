import db from '../bd/Conexion.js';

class CrearEquipoModelo {

  static async crear({ serial, modelo }) {
    const estado = "Inactivo";

    const query = `
      INSERT INTO equipos (serial, modelo, estado)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    try {
      const result = await db.query(query, [serial, modelo, estado]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error al crear equipo: ${error.message}`);
    }
  }
}

export default CrearEquipoModelo;
