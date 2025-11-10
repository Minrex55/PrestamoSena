import db from '../bd/Conexion.js';

class CrearEquipoModelo {

  static async crear({ serial, modelo, idinvitado }) {
    const estado = "Inactivo";

    const query = `
      INSERT INTO equipos (serial, modelo, estado, idinvitado)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    try {
      const result = await db.query(query, [serial, modelo, estado, idinvitado]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error al crear equipo: ${error.message}`);
    }
  }
}

export default CrearEquipoModelo;
