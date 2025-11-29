import Conexion from '../bd/Conexion.js';

class EliminarInvitadoModelo {
  constructor() {
    if (EliminarInvitadoModelo.instance) {
      return EliminarInvitadoModelo.instance
    }
    this.db = Conexion;
    EliminarInvitadoModelo.instance = this;
  }

  async eliminarInvitado(idinvitado) {
    const query = `DELETE FROM invitado WHERE idinvitado = $1 RETURNING *`;

    try {
      const resultado = await this.db.query(query, [idinvitado]);
      return resultado.rows[0] || null
    }catch(error) {
      console.error('Error al eliminar el invitado', error)
    }
  }
}

export default new EliminarInvitadoModelo();