import Conexion from '../bd/Conexion.js';

class EliminarEquipoModelo {
  constructor() {
    if (EliminarEquipoModelo.instance) {
      return EliminarEquipoModelo.instance
    }
    this.db = Conexion;
    EliminarEquipoModelo.instance = this;
  }

  async eliminarEquipo(idequipo) {
    const query = `DELETE FROM equipos WHERE idequipo = $1 RETURNING *`;

    try {
      const resultado = await this.db.query(query, [idequipo])
      return resultado.rows[0] || null
    }catch(error) {
      console.error('Error al eliminar el equipo', error);
    }
  }
}

export default new EliminarEquipoModelo();