import Conexion from "../bd/Conexion.js";

class ActualizarInvitadoModelo {
    constructor(){
        if (ActualizarInvitadoModelo.instance){
            return ActualizarInvitadoModelo.instance
        }

        this.db = Conexion
        ActualizarInvitadoModelo.instance = this
    }

    async validacionInvitadoActualizar(documento, telefono, correo, idinvitado) {
        const query = `SELECT * FROM invitado WHERE (documento = $1 OR telefono = $2 OR correopersonal = $3) AND idinvitado != $4;`;

        try {
            const resultado = await this.db.query(query, [documento, telefono, correo, idinvitado]);
            return resultado.rows.length > 0;
        }catch(error) {
            console.log('Error al verificar el invitado en la base de datos', error)
        }
    }

    async actualizarInvitado(idinvitado, invitado) {
        const {documento, nombres, telefono, correo, contrasena} = invitado;
        const query = `UPDATE invitado SET documento = $1, nombres =  $2, telefono = $3, correopersonal = $4, contrasena = $5 WHERE idinvitado = $6 RETURNING *`;
        const valores = [documento, nombres, telefono, correo, contrasena, idinvitado];

        try {
            const resultado = await this.db.query(query, valores);
            return resultado.rows[0];
        }catch(error) {
            console.error("Error al actualizar el invitado", error);
        }
    }
}

export default new ActualizarInvitadoModelo();