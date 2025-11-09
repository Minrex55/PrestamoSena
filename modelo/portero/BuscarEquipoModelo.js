import Conexion from '../bd/Conexion.js';

class BuscarEquipoModelo {
  constructor() {
    if (BuscarEquipoModelo.instance) {
      return BuscarEquipoModelo.instance;
    }

    this.db = Conexion;
    BuscarEquipoModelo.instance = this;
  }

  /*Buscar equipo por ID*/
  async buscarPorId(idequipo) {
    const query = `SELECT * FROM equipos WHERE idequipo = $1;`;
    try {
      const result = await this.db.query(query, [idequipo]);
      return result.rows[0] || null;
    } catch (err) {
      console.error('❌ Error al buscar equipo por ID:', err.message);
      throw err;
    }
  }

  /*Buscar equipo por MODELO*/
  async buscarPorModelo(modelo) {
    const query = `SELECT * FROM equipos WHERE modelo = $1;`;
    try {
      const result = await this.db.query(query, [modelo]);
      return result.rows[0] || null;
    } catch (err) {
      console.error('❌ Error al buscar equipo por modelo:', err.message);
      throw err;
    }
  }

  /*Buscar equipo por serial*/
  async buscarPorSerial(serial) {
    const query = `SELECT * FROM equipos WHERE serial = $1;`;
    try {
      const result = await this.db.query(query, [serial]);
      return result.rows[0] || null;
    } catch (err) {
      console.error('❌ Error al buscar equipo por serial:', err.message);
      throw err;
    }
  }

  /*Listar todos los equipos*/
  async listarTodos() {
    const query = `SELECT * FROM equipos ORDER BY idequipo ASC;`;
    try {
      const result = await this.db.query(query);
      return result.rows;
    } catch (err) {
      console.error('❌ Error al listar equipos:', err.message);
      throw err;
    }
  }
}

export default new BuscarEquipoModelo();
