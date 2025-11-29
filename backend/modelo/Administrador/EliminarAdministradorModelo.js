import Conexion from '../bd/Conexion.js';

class EliminarAdministradorModelo {
  constructor() {
    if (EliminarAdministradorModelo.instance) {
      return EliminarAdministradorModelo.instance
    }
    this.db = Conexion;
    EliminarAdministradorModelo.instance = this;
  }

  async eliminarAdministrador(idadmin) {
    const query = `DELETE FROM administrador WHERE idadmin = $1 RETURNING *`;
    try {
      const resultado = await this.db.query(query, [idadmin]);

      if (resultado.rowCount === 0) {
        return {
        exito: false,
        mensaje: `El administrador con ID ${idadmin} no existe`
        } 
      }

      return {
        exito: true,
        mensaje: `Administrador eliminado correctamente`,
        data: resultado.rows[0]
      }

    }catch(error) {
      console.error('Error al eliminar el administrador', error)
    }
  }
}

export default new EliminarAdministradorModelo();