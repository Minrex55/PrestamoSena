import Conexion from '../bd/Conexion.js';

class ObtenerEquipoModelo {
    constructor() {
        if (ObtenerEquipoModelo.instance) {
            return ObtenerEquipoModelo.instance
        }
        this.db = Conexion;
        ObtenerEquipoModelo.instance = this;
    }

    async obtenerEquipoPorId(idequipo) {
        const query = `SELECT * FROM equipos WHERE idequipo = $1;`
        
        try {
            const resultado = await this.db.query(query, [idequipo]);
            return resultado.rows[0] || null;
        } catch (error) {
            console.error('Error al obtener el equipo', error);
        }
    }
    
    async obtenerEquipoPorModelo(modelo) {
        const query = `SELECT * FROM equipos WHERE modelo = $1;`

        try {
            const resultado = await this.db.query(query, [modelo]);
            return resultado.rows || null;
        } catch (error) {
            console.error('Error al obtener el equipo', error);
        }
    }

    async obtenerEquipoPorNumeroDeSerie(numerodeserie) {
        const query = `SELECT * FROM equipos WHERE numerodeserie = $1;`

        try {
            const resultado = await this.db.query(query, [numerodeserie]);
            return resultado.rows[0] || null;
        } catch (error) {
            console.error('Error al obtener el equipo', error);
        }
    }

    async obtenerEquipos() {
        const query = `SELECT * FROM equipos ORDER BY idequipo ASC`

        try {
            const resultado = await this.db.query(query);
            return resultado.rows || null;
        } catch (error) {
            console.error('Error al obtener equipos', error);
        }
    }
}

export default new ObtenerEquipoModelo();