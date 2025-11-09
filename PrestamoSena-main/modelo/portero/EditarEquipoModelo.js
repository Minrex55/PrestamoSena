import db from '../bd/Conexion.js';

class EditarEquipoModelo {

  static async editarEquipo(id, datos) {
    const fields = Object.keys(datos);
    const values = Object.values(datos);

    if (fields.length === 0) {
      throw new Error('No se proporcionaron datos para actualizar');
    }

    const setClause = fields
      .map((field, index) => `${field} = $${index + 1}`)
      .join(', ');

    const query = `UPDATE equipos SET ${setClause} WHERE idequipo = $${fields.length + 1} RETURNING *`;
    values.push(id);

    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error al actualizar el equipo:', error);
      throw error;
    }
  }
}

export default EditarEquipoModelo;
