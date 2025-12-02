import Conexion from '../bd/Conexion.js';

class CrearEquipoModelo {
    constructor() {
      if (CrearEquipoModelo.instance) {
        return CrearEquipoModelo.instance
      }
      this.db = Conexion;
      CrearEquipoModelo.instance = this;
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

    async crearEquipo(equipos) {
      const {modelo, numerodeserie, idinvitado, estado} = equipos
      const query = `INSERT INTO equipos (modelo, numerodeserie, idinvitado, estado) VALUES ($1, $2, $3, $4) RETURNING *;`
      const valores = [modelo, numerodeserie, idinvitado, estado]
      try {
        const resultado = await this.db.query(query, valores)
        return resultado.rows[0]
      }catch(error) {
        console.error('Error al registrar el equipo', error)
      }
    }
}

export default new CrearEquipoModelo();