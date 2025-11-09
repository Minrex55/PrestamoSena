import db from '../bd/Conexion.js';

class EliminarPorteroModelo {
  constructor(documento, nombres, telefono, correopersonal, contrasena, rol) {
    this.documento = documento;
    this.nombres = nombres;
    this.telefono = telefono;
    this.correopersonal = correopersonal;
    this.contrasena = contrasena;
    this.rol = rol;
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

export default EliminarPorteroModelo;