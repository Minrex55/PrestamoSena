const db = require('../bd/Conexion');

class BuscarPorteroModelo {
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
}

module.exports = BuscarPorteroModelo;