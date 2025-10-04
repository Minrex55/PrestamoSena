const Conexion = require('./bd/Conexion');

class InvitadoModelo {
  constructor() {
    if (InvitadoModelo.instance) {
      return InvitadoModelo.instance;
    }

    this.db = Conexion;
    InvitadoModelo.instance = this;
  }

  /*Buscar invitado por ID*/
  async buscarPorId(idinvitado) {
    const query = `SELECT * FROM invitado WHERE idinvitado = $1;`;
    try {
      const result = await this.db.query(query, [idinvitado]);
      return result.rows[0] || null;
    } catch (err) {
      console.error('❌ Error al buscar invitado por ID:', err.message);
      throw err;
    }
  }

  /*Buscar invitado por Nombres*/
  async buscarPorNombres(nombres) {
    const query = `SELECT * FROM invitado WHERE nombres = $1;`;
    try {
      const result = await this.db.query(query, [nombres]);
      return result.rows[0] || null;
    } catch (err) {
      console.error('❌ Error al buscar invitado por NOMBRES:', err.message);
      throw err;
    }
  }

  /* Buscar invitado por documento*/
  async buscarPorDocumento(documento) {
    const query = `SELECT * FROM invitado WHERE documento = $1;`;
    try {
      const result = await this.db.query(query, [documento]);
      return result.rows[0] || null;
    } catch (err) {
      console.error('❌ Error al buscar invitado por documento:', err.message);
      throw err;
    }
  }

  /**
   * Listar todos los invitados
   */
  async listarTodos() {
    const query = `SELECT * FROM invitado ORDER BY idinvitado ASC;`;
    try {
      const result = await this.db.query(query);
      return result.rows;
    } catch (err) {
      console.error('❌ Error al listar invitados:', err.message);
      throw err;
    }
  }
}

module.exports = new InvitadoModelo();
