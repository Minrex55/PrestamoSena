import Conexion from '../bd/Conexion.js';

class ObtenerInvitadoModelo {
    constructor() {
        if (ObtenerInvitadoModelo.instance) {
            return ObtenerInvitadoModelo.instance
        }
        this.db = Conexion;
        ObtenerInvitadoModelo.instance = this;
    }

    async obtenerInvitadoPorId(idinvitado) {
        const query = `SELECT * FROM invitado WHERE idinvitado = $1;`
        
        try {
            const resultado = await this.db.query(query, [idinvitado]);
            return resultado.rows[0] || null;
        } catch (error) {
            console.error('Error al obtener el invitado', error);
        }
    }

    async obtenerInvitadoPorDocumento(documento) {
        const query = `SELECT * FROM invitado WHERE documento = $1;`
        
        try {
            const resultado = await this.db.query(query, [documento]);
            return resultado.rows[0] || null;
        } catch (error) {
            console.error('Error al obtener el invitado', error);
        }
    }

    async obtenerInvitadoPorNombre(nombres) {
        const query = `SELECT * FROM invitado WHERE nombres ILIKE $1;`
        
        try {
            const resultado = await this.db.query(query, [`%${nombres}%`]);
            return resultado.rows || null;
        } catch (error) {
            console.error('Error al obtener el invitado', error);
        }
    }

    async obtenerInvitados() {
        const query = `SELECT * FROM invitado ORDER BY idinvitado ASC;`
        
        try {
            const resultado = await this.db.query(query);
            return resultado.rows || null;
        } catch (error) {
            console.error('Error al obtener invitados', error);
        }
    }
}

export default new ObtenerInvitadoModelo()