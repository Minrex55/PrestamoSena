import Conexion from '../bd/Conexion.js';

class ObtenerPorteroModelo {
    constructor() {
        if (ObtenerPorteroModelo.instance) {
            return ObtenerPorteroModelo.instance
        }
        this.db = Conexion;
        ObtenerPorteroModelo.instance = this;
    }

    async mostrarTodos() {
    const query = `SELECT * FROM portero ORDER BY idportero;`
      try {
        const result = await this.db.query(query);
        return result.rows;
      } catch (error) {
        console.error('Error al obtener los datos de portería:', error);
      }
    }
  
    async buscarporId(idportero) {
        const query = `SELECT * FROM portero WHERE idportero = $1;`
      try {
        const result = await this.db.query(query, [idportero]);
        return result.rows[0] || null;
      } catch (error) {
        console.error('Error al obtener el portero:', error);
      }
    }
}

export default new ObtenerPorteroModelo()