import db from '../bd/Conexion.js';

class EditarSuperPorteroModelo {
  static async editarSuperPortero(id, datos) {
    if (!id) {
      throw new Error('ID del SuperPortero no proporcionado');
    }

    // Verificamos que el usuario sea SuperPortero
    const checkQuery = 'SELECT rol FROM funcionarios WHERE idportero = $1';
    const checkResult = await db.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      throw new Error('SuperPortero no encontrado.');
    }

    if (checkResult.rows[0].rol !== 'Superportero') {
      throw new Error('No cuentas con los permisos para realizar esta acción');
    }

    const fields = Object.keys(datos);
    const values = Object.values(datos);

    if (!fields || fields.length === 0) {
      throw new Error('No se proporcionaron datos para actualizar');
    }

    // Escapamos los nombres de columnas para que PostgreSQL no falle
    const setClause = fields.map((field, index) => `"${field}" = $${index + 1}`).join(', ');

    const query = `UPDATE funcionarios SET ${setClause} WHERE idportero = $${fields.length + 1}`;
    values.push(id);

    try {
      await db.query(query, values);
      return { message: 'SuperPortero actualizado correctamente' };
    } catch (error) {
      console.error('Error al actualizar el SuperPortero:', error);
      throw error;
    }
  }
}

export default EditarSuperPorteroModelo;
