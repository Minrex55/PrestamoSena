import db from '../bd/Conexion.js';

class EliminarEquipoModelo {
  static async eliminarEquipo(id) {
    const consulta = 'DELETE FROM equipos WHERE idequipo = $1 RETURNING *';
    
    try {
      const result = await db.query(consulta, [id]);

      if (result.rowCount === 0) {
        return null;
      }

      return result.rows[0]; // Retorna el equipo eliminado
    } catch (error) {
      console.error('Error al eliminar el equipo en el modelo:', error);
      throw error;
    }
  }
}

export default EliminarEquipoModelo;
