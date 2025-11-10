import db from '../bd/Conexion.js';

class EliminarInvitadoModelo {
  static async eliminarInvitado(id) {
    const consulta = 'DELETE FROM invitado WHERE idInvitado = $1 RETURNING *';

    try {
      const result = await db.query(consulta, [id]);

      if (result.rowCount === 0) {
        return null;
      }

      return result.rows[0]; // Retorna el invitado eliminado
    } catch (error) {
      console.error('Error al eliminar el invitado en el modelo:', error);
      throw error;
    }
  }
}

export default EliminarInvitadoModelo;
