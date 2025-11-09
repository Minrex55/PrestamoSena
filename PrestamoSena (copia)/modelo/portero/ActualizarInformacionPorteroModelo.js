import db from '../bd/Conexion.js';

class ActualizarInformacionPorteroModelo {
  constructor(correopersonal, contrasena) {
    this.correopersonal = correopersonal;
    this.contrasena = contrasena;
  }
  static async actualizarPorId(idportero, datosActualizados) {
    const { correopersonal, contrasena } = datosActualizados;
    const query = `
      UPDATE porteros
      SET correopersonal = $1,
          contrasena = $2
      WHERE idportero = $3
      RETURNING *;
    `;
    try {
      const result = await db.query(query, [correopersonal, contrasena, idportero]);
      return result.rows[0] || null;
    } catch (err) {
      console.error('❌ Error al actualizar información del portero:', err.message);
      throw err;
    }
  }
}

export default ActualizarInformacionPorteroModelo;