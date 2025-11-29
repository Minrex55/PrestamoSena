import Conexion from "../bd/Conexion.js";

class CrearInvitadoModelo {
    constructor(){
        if (CrearInvitadoModelo.instance) {
            return CrearInvitadoModelo.instance
        }

        this.db = Conexion;
        CrearInvitadoModelo.instance =  this;
    }

    async validacionInvitado(documento, telefono, correo) {
        const query = `SELECT * FROM invitado WHERE documento = $1 OR correopersonal = $2 OR telefono = $3;`;

        try {
            const resultado = await this.db.query(query, [documento, telefono, correo]);
            return resultado.rows.length > 0;
        }catch(error) {
            console.log('Error al verificar el invitado en la base de datos', error)
        }
    }

    async crearInvitado(invitado) {
        const {
            documento,
            nombres,
            telefono,
            correo,
            contrasena,
        } = invitado

        const query = `INSERT INTO invitado (documento, nombres, telefono, correopersonal, contrasena)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;`;

        const valores = [
            documento, nombres, telefono, correo, contrasena
        ];

        try{
            const resultado = await this.db.query(query, valores);
            return resultado.rows[0];
        }catch(error){
            console.log('Error al crear invitado')
            throw error;
        }
    }
}

export default new CrearInvitadoModelo();