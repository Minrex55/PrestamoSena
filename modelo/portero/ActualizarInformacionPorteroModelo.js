const db = require('../bd/Conexion');

class ActualizarInformacionPorteroModelo {
  constructor(correopersonal, contrasena) {
    this.correopersonal = correopersonal;
    this.contrasena = contrasena;
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

module.exports = ActualizarInformacionPorteroModelo;