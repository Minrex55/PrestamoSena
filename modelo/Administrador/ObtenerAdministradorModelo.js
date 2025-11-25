import Conexion from '../bd/Conexion.js';

class ObtenerAdministradorModelo {
    constructor() {
        if (ObtenerAdministradorModelo.instance) {
            return ObtenerAdministradorModelo.instance
        }
        this.db = Conexion;
        ObtenerAdministradorModelo.instance = this;
    }

  async mostrarTodos() {
     const query = `SELECT * FROM administrador ORDER BY idadmin;`
      try {
        const resultado = await this.db.query(query);
        return resultado.rows || null;
      } catch (error) {
        console.error('Error al obtener los datos de Administración:', error);
        throw error;
      }
    }
  
    async buscarporId(idadmin) {
      const query = `SELECT * FROM administrador WHERE idadmin = $1;`
      try {
        const resultado = await this.db.query(query, [idadmin]);
        return resultado.rows[0] || null;
      } catch (error) {
        console.error('Error al obtener el administrador:', error);
        throw error;
      }
    }
}


export default new ObtenerAdministradorModelo();