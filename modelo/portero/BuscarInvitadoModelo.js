import db from '../bd/Conexion.js';

class BuscarInvitadoModelo {
  async buscarPorId(idinvitado) {
    const query = 'SELECT * FROM invitado WHERE idinvitado = $1';
    const result = await db.query(query, [idinvitado]);
    return result.rows[0] || null;
  }

  async buscarPorNombre(nombre) {
    const query = 'SELECT * FROM invitado WHERE nombres ILIKE $1';
    const result = await db.query(query, [`%${nombre}%`]);
    return result.rows;
  }

  async buscarPorDocumento(documento) {
    const query = 'SELECT * FROM invitado WHERE documento = $1';
    const result = await db.query(query, [documento]);
    return result.rows[0] || null;
  }

  async listarTodos() {
    const query = 'SELECT * FROM invitado ORDER BY idinvitado ASC';
    const result = await db.query(query);
    return result.rows;
  }
}

export default new BuscarInvitadoModelo();
