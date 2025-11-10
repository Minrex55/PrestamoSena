import db from '../bd/Conexion.js';

class EliminarSuperPorteroModelo {
  static async eliminarSuperPortero(id) {
    // 1️⃣ Verificar si existe y si es SuperPortero
    const checkQuery = 'SELECT rol FROM funcionarios WHERE idportero = $1';
    const checkResult = await db.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      throw new Error('SuperPortero no encontrado.');
    }

    if (checkResult.rows[0].rol !== 'Superportero') {
      throw new Error('Solo se pueden eliminar Superporteros.');
    }

    // 2️⃣ Si pasa la verificación, eliminar
    try {
      const result = await db.query('DELETE FROM funcionarios WHERE idportero = $1', [id]);
      return result.rowCount > 0; // true si eliminó, false si no
    } catch (error) {
      console.error('Error al eliminar el Superportero:', error);
      throw error;
    }
  }
}

export default EliminarSuperPorteroModelo;
