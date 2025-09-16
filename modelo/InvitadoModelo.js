const bd = require('./bd/Conexion');

class InvitadoModelo {
    constructor(documento, nombres, telefono, correoPersonal, estado){
        this.documento = documento;
        this.nombres = nombres;
        this.telefono = telefono;
        this.correoPersonal = correoPersonal;
        this.estado = estado;
    }
    async buscarId(id) {
        try {
            const result = await bd.query('SELECT * FROM invitado WHERE idinvitado= ?', [id]);
            return result.rows;
        }catch(error){
            console.error('Error al obtener el usuario', error);
            throw error;
        }
    }
}

module.exports = InvitadoModelo;