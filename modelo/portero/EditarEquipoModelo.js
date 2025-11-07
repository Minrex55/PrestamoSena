const db = require('../bd/Conexion');

class EditarEquipoModelo {
  constructor(serial, modelo, marca, estado) {
    this.serial = serial;
    this.modelo = modelo;
    this.marca = marca;
    this.estado = 'Inactivo';
  }
  async editarEquipo(id, datos) {
      const fields = Object.keys(datos);
      const values = Object.values(datos);
  
      if (fields.length === 0) {
        throw new Error('No se proporcionaron datos para actualizar');
      }
  
      const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
      const query = `UPDATE equipos SET ${setClause} WHERE idequipo = $${fields.length + 1}`;
  
      values.push(id);
  
      try {
        await db.query(query, values);
        return { message: 'Equipo actualizado correctamente' };
      } catch (error) {
        console.error('Error al actualizar el equipo:', error);
        throw error;
      }
    }
}

module.exports = EditarEquipoModelo;