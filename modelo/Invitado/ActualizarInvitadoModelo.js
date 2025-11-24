import Conexion from "../bd/Conexion.js";

class ActualizarInvitadoModelo {
    constructor(){
        if (ActualizarInvitadoModelo.instance){
            return ActualizarInvitadoModelo.instance
        }

        this.db = Conexion
        ActualizarInvitadoModelo.instance = this
    }

    async actualizarInvitado(idinvitado, invitado) {
        const {documento, nombres, telefono, correo, contrasena} = invitado;
        
        const query = `UPDATE invitado SET documento = $1, nombres =  $2, telefono = $3, correopersonal = $4, contrasena = $5 WHERE idinvitado = $6 RETURNING *`;

        const valores = [documento, nombres, telefono, correo, contrasena, idinvitado];

        try {
            const resultado = await this.db.query(query, valores);
            return resultado.rows[0];
        }catch(error) {
            console.error("Error al editar usuario", error);
            throw error;
        }
    }
}

export default new ActualizarInvitadoModelo();