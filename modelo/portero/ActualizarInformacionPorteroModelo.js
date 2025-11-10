import db from '../bd/Conexion.js';

class ActualizarInformacionPorteroModelo {
  constructor(correopersonal, contrasena) {
    this.correopersonal = correopersonal;
    this.contrasena = contrasena;
  }

  static async actualizarPorId(idportero, datosActualizados) {
    const { correopersonal, contrasena } = datosActualizados;

    try {
      // 1️⃣ Verificar que el usuario sea un portero
      const checkQuery = 'SELECT rol FROM funcionarios WHERE idportero = $1';
      const checkResult = await db.query(checkQuery, [idportero]);

      if (checkResult.rows.length === 0) {
        throw new Error('Portero no encontrado.');
      }

      if (checkResult.rows[0].rol !== 'Portero') {
        throw new Error('Solo los porteros pueden actualizar su información.');
      }

      // 2️⃣ Actualizar la información
      const updateQuery = `
        UPDATE funcionarios
        SET correopersonal = $1,
            contrasena = $2
        WHERE idportero = $3
        RETURNING *;
      `;

      const result = await db.query(updateQuery, [correopersonal, contrasena, idportero]);
      return result.rows[0] || null;

    } catch (err) {
      console.error('❌ Error al actualizar información del portero:', err.message);
      throw err;
    }
  }
}

export default ActualizarInformacionPorteroModelo;
