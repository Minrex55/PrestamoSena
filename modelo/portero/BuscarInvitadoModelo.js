import Conexion from '../bd/Conexion.js';

class BuscarInvitadoModelo {
  constructor() {
    if (BuscarInvitadoModelo.instance) {
      return BuscarInvitadoModelo.instance;
    }

    this.db = Conexion;
    BuscarInvitadoModelo.instance = this;
  }

  /*Buscar invitado por ID*/
  async buscarPorId(idinvitado) {
    const query = `SELECT * FROM invitados WHERE idinvitado = $1;`;
    try {
      const result = await this.db.query(query, [idinvitado]);
      return result.rows[0] || null;
    } catch (err) {
      console.error('❌ Error al buscar invitado por ID:', err.message);
      throw err;
    }
  }

  /*Buscar invitado por nombre*/
  async buscarPorNombre(nombre) {
    const query = `SELECT * FROM invitados WHERE nombre ILIKE $1;`;
    try {
      const result = await this.db.query(query, [`%${nombre}%`]);
      return result.rows;
    } catch (err) {
      console.error('❌ Error al buscar invitado por nombre:', err.message);
      throw err;
    }
  }

  /*Buscar invitado por documento*/
  async buscarPorDocumento(documento) {
    const query = `SELECT * FROM invitados WHERE documento = $1;`;
    try {
      const result = await this.db.query(query, [documento]);
      return result.rows[0] || null;
    } catch (err) {
      console.error('❌ Error al buscar invitado por documento:', err.message);
      throw err;
    }
  }

  /*Listar todos los invitados*/
  async listarTodos() {
    const query = `SELECT * FROM invitados ORDER BY idinvitado ASC;`;
    try {
      const result = await this.db.query(query);
      return result.rows;
    } catch (err) {
      console.error('❌ Error al listar invitados:', err.message);
      throw err;
    }
  }
}

export default new BuscarInvitadoModelo();
