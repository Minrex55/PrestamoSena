const db = require('../bd/Conexion');

class EliminarEquipoModelo {
  constructor(serial, modelo, marca, estado) {
    this.serial = serial;
    this.modelo = modelo;
    this.marca = marca;
    this.estado = 'Inactivo';
  }
 async eliminarEquipo(id) {
     try {
       const result = await db.query('DELETE FROM equipos WHERE idequipo = $1', [id]);
       return result.rowCount > 0;
     } catch (error) {
       console.error('Error al eliminar el equipo:', error);
       throw error;
     }
   }
 }

module.exports = EliminarEquipoModelo;