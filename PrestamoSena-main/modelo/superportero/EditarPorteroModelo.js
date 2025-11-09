import db from '../bd/Conexion.js';

class EditarPorteroModelo {
  constructor(documento, nombres, telefono, correopersonal, contrasena, rol) {
    this.documento = documento;
    this.nombres = nombres;
    this.telefono = telefono;
    this.correopersonal = correopersonal;
    this.contrasena = contrasena;
    this.rol = rol;
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
}

export default EditarPorteroModelo;