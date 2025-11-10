import db from '../bd/Conexion.js';

class BuscarEquipoModelo {
  async buscarPorId(idequipo) {
    const query = 'SELECT * FROM equipos WHERE idequipo = $1';
    const result = await db.query(query, [idequipo]);
    return result.rows[0] || null;
  }

  async buscarPorModelo(modelo) {
    const query = 'SELECT * FROM equipos WHERE modelo ILIKE $1';
    const result = await db.query(query, [`%${modelo}%`]);
    return result.rows; // devuelve todos los equipos con ese modelo
  }

  async buscarPorSerial(serial) {
    const query = 'SELECT * FROM equipos WHERE serial = $1';
    const result = await db.query(query, [serial]);
    return result.rows; // devuelve todos los equipos con ese serial
  }

  async listarTodos() {
    const query = 'SELECT * FROM equipos ORDER BY idequipo ASC';
    const result = await db.query(query);
    return result.rows;
  }
}

export default new BuscarEquipoModelo();
