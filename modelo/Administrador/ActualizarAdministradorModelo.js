import Conexion from "../bd/Conexion.js";

class ActualizarAdministradorModelo {
    constructor(){
        if (ActualizarAdministradorModelo.instance){
            return ActualizarAdministradorModelo.instance
        }

        this.db = Conexion
        ActualizarAdministradorModelo.instance = this
    }

    async actualizarAdministrador(idadmin, administrador) {
        const {documento, nombres, telefono, correopersonal, contrasena} = administrador;
        
        const query = `UPDATE administrador SET documento = $1, nombres =  $2, telefono = $3, correopersonal = $4, contrasena = $5 WHERE idadmin = $6 RETURNING *`;

        const valores = [documento, nombres, telefono, correopersonal, contrasena, idadmin];
        try {
            const resultado = await this.db.query(query, valores);
            return resultado.rows[0];
        }catch(error) {
            console.error("Error al editar administrador", error);
            throw error;
        }
    }
}

export default new ActualizarAdministradorModelo();