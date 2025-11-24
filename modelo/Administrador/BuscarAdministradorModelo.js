import db from '../bd/Conexion.js';

class BuscarAdministradorModelo {
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
        const result = await db.query('SELECT * FROM administrador ORDER BY idadmin DESC');
        return result.rows;
      } catch (error) {
        console.error('Error al obtener los datos de Administración:', error);
        throw error;
      }
    }
  
    async buscarporId(id) {
      try {
        const result = await db.query('SELECT * FROM administrador WHERE idadmin = $1', [id]);
        return result.rows;
      } catch (error) {
        console.error('Error al obtener el administrador:', error);
        throw error;
      }
    }
}

export default BuscarAdministradorModelo;