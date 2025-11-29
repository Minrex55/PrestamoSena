import Conexion from '../bd/Conexion.js';

class ActualizarEquipoModelo {
  constructor() {
    if (ActualizarEquipoModelo.instance) {
      return ActualizarEquipoModelo.instance
    }
    this.db = Conexion;
    ActualizarEquipoModelo.instance = this;
  }

  async validacionEquipo(numerodeserie) {
        const query = `SELECT * FROM equipos WHERE numerodeserie = $1;`;

        try {
            const resultado = await this.db.query(query, [numerodeserie]);
            return resultado.rows.length > 0;
        }catch(error) {
            console.log('Error al verificar el equipo en la base de datos', error)
        }
    }

  async actualizarEquipo(idequipo, equipo) {
    const {modelo, numerodeserie, idinvitado} = equipo
    const query = `UPDATE equipos SET modelo = $1, numerodeserie =  $2, idinvitado = $3 WHERE idequipo = $4 RETURNING *`;
    const valores = [modelo, numerodeserie, idinvitado, idequipo];

    try {
      const resultado = await this.db.query(query, valores);
      return resultado.rows[0];
    }catch(error) {
      console.error("Error al actualizar el equipo", error);
    }
  }
}

export default new ActualizarEquipoModelo();