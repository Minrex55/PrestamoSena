import Conexion from '../bd/Conexion.js';

class ActualizarEquipoModelo {
  constructor() {
    if (ActualizarEquipoModelo.instance) {
      return ActualizarEquipoModelo.instance
    }
    this.db = Conexion;
    ActualizarEquipoModelo.instance = this;
  }

  // Ahora recibe idequipo para excluirlo de la búsqueda
  async validacionEquipo(numerodeserie, idequipo) {
        // Buscamos si existe el serial PERO que el ID sea diferente al que estamos editando
        const query = `SELECT * FROM equipos WHERE numerodeserie = $1 AND idequipo != $2;`;

        try {
            const resultado = await this.db.query(query, [numerodeserie, idequipo]);
            return resultado.rows.length > 0;
        } catch(error) {
            console.log('Error al verificar el equipo en la base de datos', error);
            throw error; // Es buena práctica lanzar el error para que el controlador se entere
        }
    }

  async actualizarEquipo(idequipo, equipo) {
    // Desestructuramos incluyendo 'estado'
    const { modelo, numerodeserie, idinvitado, estado } = equipo;
    
    // Actualizamos la consulta SQL
    const query = `UPDATE equipos 
                   SET modelo = $1, numerodeserie = $2, idinvitado = $3, estado = $4 
                   WHERE idequipo = $5 
                   RETURNING *`;
                   
    const valores = [modelo, numerodeserie, idinvitado, estado, idequipo];

    try {
      const resultado = await this.db.query(query, valores);
      return resultado.rows[0];
    } catch(error) {
      console.error("Error al actualizar el equipo", error);
      throw error;
    }
  }
}

export default new ActualizarEquipoModelo();