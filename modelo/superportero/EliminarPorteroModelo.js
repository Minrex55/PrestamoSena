import db from '../bd/Conexion.js';

class EliminarPorteroModelo {
  static async eliminarPortero(id) {
    // 1️⃣ Verificar si existe y si es portero
    const checkQuery = 'SELECT rol FROM funcionarios WHERE idportero = $1';
    const checkResult = await db.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      throw new Error('Portero no encontrado.');
    }

    if (checkResult.rows[0].rol !== 'Portero') {
      throw new Error('Solo se pueden eliminar porteros.');
    }

    // 2️⃣ Si pasa la verificación, eliminar
    try {
      const result = await db.query('DELETE FROM funcionarios WHERE idportero = $1', [id]);
      return result.rowCount > 0; // true si eliminó, false si no
    } catch (error) {
      console.error('Error al eliminar el portero:', error);
      throw error;
    }
  }
}

export default EliminarPorteroModelo;
