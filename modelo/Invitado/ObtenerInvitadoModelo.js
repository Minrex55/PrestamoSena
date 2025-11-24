import Conexion from "../bd/Conexion.js"

class ObtenerInvitadoModelo {
    constructor() {
        if (ObtenerInvitadoModelo.instance) {
            return ObtenerInvitadoModelo.instance;
        }

        this.db = Conexion;
        ObtenerInvitadoModelo.instance = this;
    }

    async obtenerInvitadoPorId(idinvitado) {
        const query = `SELECT * FROM invitado WHERE idinvitado = $1;`;
        try {
            const resultado = await this.db.query(query, [idinvitado]);
            return resultado.rows[0] || null;
        } catch (error) {
            console.error('Error al obtener usuario', error);
        }
    }
}

export default new ObtenerInvitadoModelo();