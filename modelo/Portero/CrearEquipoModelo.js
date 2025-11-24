import Conexion from '../bd/Conexion.js';

class CrearEquipoModelo {
    constructor() {
      if (CrearEquipoModelo.instance) {
        return CrearEquipoModelo.instance
      }
      this.db = Conexion;
      CrearEquipoModelo.instance = this;
    }

    async crearEquipo(equipos) {
      const {modelo, numerodeserie, idinvitado} = equipos
      const query = `INSERT INTO equipos (modelo, numerodeserie, idinvitado) VALUES ($1, $2, $3) RETURNING *;`
      const valores = [modelo, numerodeserie, idinvitado]
      try {
        const resultado = await this.db.query(query, valores)
        return resultado.rows[0]
      }catch(error) {
        console.error('Error al registrar el equipo', error)
      }
    }
}

export default new CrearEquipoModelo();