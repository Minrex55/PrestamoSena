import db from '../bd/Conexion.js';

class EditarAdministradorModelo {
  static async editarAdministrador(id, datos) {
    if (!id) {
      throw new Error('ID del Administrador no proporcionado');
    }

    // Verificamos que el usuario sea Administrador
    const checkQuery = 'SELECT rol FROM administrador WHERE idadmin = $1';
    const checkResult = await db.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      throw new Error('Administrador no encontrado.');
    }

    if (checkResult.rows[0].rol !== 'Administrador') {
      throw new Error('No cuentas con los permisos para realizar esta acción');
    }

    const fields = Object.keys(datos);
    const values = Object.values(datos);

    if (!fields || fields.length === 0) {
      throw new Error('No se proporcionaron datos para actualizar');
    }

    // Escapamos los nombres de columnas para que PostgreSQL no falle
    const setClause = fields.map((field, index) => `"${field}" = $${index + 1}`).join(', ');

    const query = `UPDATE administrador SET ${setClause} WHERE idadmin = $${fields.length + 1}`;
    values.push(id);

    try {
      await db.query(query, values);
      return { message: 'Administrador actualizado correctamente' };
    } catch (error) {
      console.error('Error al actualizar el Administrador:', error);
      throw error;
    }
  }
}

export default EditarAdministradorModelo;
