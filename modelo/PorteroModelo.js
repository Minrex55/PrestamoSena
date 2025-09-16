const db = require('./bd/Conexion');

class PorteroModelo {
  constructor(documento, nombres, telefono, correopersonal, contrasena, rol) {
    this.documento = documento;
    this.nombres = nombres;
    this.telefono = telefono;
    this.correopersonal = correopersonal;
    this.contrasena = contrasena;
    this.rol = rol;
  }

  async mostrarTodos() {
    try {
      const result = await db.query('SELECT * FROM porteria ORDER BY idportero DESC');
      return result.rows;
    } catch (error) {
      console.error('Error al obtener los datos de portería:', error);
      throw error;
    }
  }

  async buscarporId(id) {
    try {
      const result = await db.query('SELECT * FROM porteria WHERE idportero = $1', [id]);
      return result.rows;
    } catch (error) {
      console.error('Error al obtener el portero:', error);
      throw error;
    }
  }

  async guardarPortero() {
    const query = `
      INSERT INTO porteria (documento, nombres, telefono, correopersonal, contrasena, rol)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING idportero
    `;
    const values = [this.documento, this.nombres, this.telefono, this.correopersonal, this.contrasena, this.rol];

    try {
      const result = await db.query(query, values);
      this.idportero = result.rows[0].idportero;
      return this;
    } catch (error) {
      console.error('Error al guardar el portero:', error);
      throw error;
    }
  }

  async editarPortero(id, datos) {
    const fields = Object.keys(datos);
    const values = Object.values(datos);

    if (fields.length === 0) {
      throw new Error('No se proporcionaron datos para actualizar');
    }

    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const query = `UPDATE porteria SET ${setClause} WHERE idportero = $${fields.length + 1}`;

    values.push(id);

    try {
      await db.query(query, values);
      return { message: 'Portero actualizado correctamente' };
    } catch (error) {
      console.error('Error al actualizar el portero:', error);
      throw error;
    }
  }

  async eliminarPortero(id) {
    try {
      const result = await db.query('DELETE FROM porteria WHERE idportero = $1', [id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error al eliminar el portero:', error);
      throw error;
    }
  }
}

module.exports = PorteroModelo;