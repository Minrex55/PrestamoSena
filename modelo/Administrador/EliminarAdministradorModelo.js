import db from '../bd/Conexion.js';

class EliminarAdministradorModelo {
  static async eliminarAdministrador(id) {
    // 1️⃣ Verificar si existe y si es Administrador
    const checkQuery = 'SELECT rol FROM administrador WHERE idadmin = $1';
    const checkResult = await db.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      throw new Error('Administrador no encontrado.');
    }

    if (checkResult.rows[0].rol !== 'Administrador') {
      throw new Error('Solo se pueden eliminar Administradors.');
    }

    // 2️⃣ Si pasa la verificación, eliminar
    try {
      const result = await db.query('DELETE FROM administrador WHERE idadmin = $1', [id]);
      return result.rowCount > 0; // true si eliminó, false si no
    } catch (error) {
      console.error('Error al eliminar el Administrador:', error);
      throw error;
    }
  }
}

export default EliminarAdministradorModelo;
