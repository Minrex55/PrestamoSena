import Conexion from '../bd/Conexion.js';

class EliminarPorteroModelo {
  constructor() {
    if (EliminarPorteroModelo.instance) {
      return EliminarPorteroModelo.instance
    }
    this.db = Conexion;
    EliminarPorteroModelo.instance = this;
  }

  async eliminarPortero(idportero) {
    const query = `DELETE FROM portero WHERE idportero = $1 RETURNING *`;
    try {
      const resultado = await this.db.query(query, [idportero]);

      if (resultado.rowCount === 0) {
        return {
        exito: false,
        mensaje: `El portero con ID ${idportero} no existe`
        } 
      }

      return {
        exito: true,
        mensaje: `Portero eliminado correctamente`,
        data: resultado.rows[0]
      }

    }catch(error) {
      console.error('Error al eliminar el portero', error)
    }
  }
}

export default new EliminarPorteroModelo();