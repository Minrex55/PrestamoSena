import db from '../bd/Conexion.js';

class EditarEquipoModelo {
  static async editarEquipo(id, datos) {
    // Campos permitidos para editar
    const camposPermitidos = ['modelo', 'serial', 'estado', 'idinvitado'];
    const fields = Object.keys(datos).filter(f => camposPermitidos.includes(f));
    const values = fields.map(f => datos[f]);

    if (fields.length === 0) {
      throw new Error('No se proporcionaron datos válidos para actualizar');
    }

    // Escapamos los nombres de columnas con comillas
    const setClause = fields.map((field, i) => `"${field}" = $${i + 1}`).join(', ');
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
