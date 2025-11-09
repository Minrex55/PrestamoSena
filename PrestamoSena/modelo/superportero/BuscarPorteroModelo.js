import db from '../bd/Conexion.js';

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
        const result = await db.query('SELECT * FROM funcionarios ORDER BY idportero DESC');
        return result.rows;
      } catch (error) {
        console.error('Error al obtener los datos de portería:', error);
        throw error;
      }
    }
  
    async buscarporId(id) {
      try {
        const result = await db.query('SELECT * FROM funcionarios WHERE idportero = $1', [id]);
        return result.rows;
      } catch (error) {
        console.error('Error al obtener el portero:', error);
        throw error;
      }
    }
}

export default BuscarPorteroModelo;