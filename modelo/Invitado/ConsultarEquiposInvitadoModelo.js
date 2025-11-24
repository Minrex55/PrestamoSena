import Conexion from "../bd/Conexion.js";

class ConsultarEquiposInvitadoModelo {
    constructor() {
        if (ConsultarEquiposInvitadoModelo.instance) {
            return ConsultarEquiposInvitadoModelo.instance;
        }

        this.db = Conexion;
        ConsultarEquiposInvitadoModelo.instance = this;
    }

    async obtenerEquiposPorInvitado(idinvitado) {
        const query = `SELECT * FROM equipos WHERE idinvitado = $1 ORDER BY idequipo ASC;`;
        const valores = [idinvitado];

        try {
            const resultado = await this.db.query(query, valores);
            return resultado.rows;
        } catch (error) {
            console.error('Error al obtener equipos del invitado', error);
        }
    }
}

export default new ConsultarEquiposInvitadoModelo();
