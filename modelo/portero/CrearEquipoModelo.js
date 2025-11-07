const db = require('../bd/Conexion');
const bcrypt = require('bcrypt');

class CrearEquipoModelo {
  constructor(serial, modelo, marca, estado) {
    this.serial = serial;
    this.modelo = modelo;
    this.marca = marca;
    this.estado = 'Inactivo';
  }

  // Método estático para crear un portero (hashea la contraseña y lo guarda en BD)
  static async crear(serial, modelo, marca, estado) {

    const query = `
      INSERT INTO equipos (serial, modelo, marca, estado)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [serial, modelo, marca, "Inactivo"];

    try {
      const result = await db.query(query, values);
      return result.rows[0]; // Devuelve el portero creado (sin la contraseña en texto plano)
    } catch (error) {
      // Si hay un error (ej. correo duplicado, documento duplicado, etc.)
      throw new Error(`Error al crear equipo: ${error.message}`);
    }
  }
}

module.exports = CrearEquipoModelo;