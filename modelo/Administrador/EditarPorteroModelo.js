import db from '../bd/Conexion.js';

class EditarPorteroModelo {
  static async editarPortero(id, datos) {
    if (!id) {
      throw new Error('ID del portero no proporcionado');
    }

    // Verificamos que el usuario sea portero
    const checkQuery = 'SELECT rol FROM portero WHERE idportero = $1';
    const checkResult = await db.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      throw new Error('Portero no encontrado.');
    }

    if (checkResult.rows[0].rol !== 'Portero') {
      throw new Error('No cuentas con los permisos para realizar esta acción');
    }

    const fields = Object.keys(datos);
    const values = Object.values(datos);

    if (!fields || fields.length === 0) {
      throw new Error('No se proporcionaron datos para actualizar');
    }

    // Escapamos los nombres de columnas para que PostgreSQL no falle
    const setClause = fields.map((field, index) => `"${field}" = $${index + 1}`).join(', ');

    const query = `UPDATE portero SET ${setClause} WHERE idportero = $${fields.length + 1}`;
    values.push(id);

    try {
      await db.query(query, values);
      return { message: 'Portero actualizado correctamente' };
    } catch (error) {
      console.error('Error al actualizar el portero:', error);
      throw error;
    }
  }
}

export default EditarPorteroModelo;
