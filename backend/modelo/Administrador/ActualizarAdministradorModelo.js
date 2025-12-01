import Conexion from "../bd/Conexion.js";

class ActualizarAdministradorModelo {
    constructor(){
        if (ActualizarAdministradorModelo.instance){
            return ActualizarAdministradorModelo.instance
        }

        this.db = Conexion
        ActualizarAdministradorModelo.instance = this
    }

    async validacionAdministradorActualizar(documento, telefono, correopersonal, idadmin) {
        const query = `SELECT * FROM administrador WHERE (documento = $1 OR telefono = $2 OR correopersonal = $3) AND idadmin != $4;`;

        try {
            const resultado = await this.db.query(query, [documento, telefono, correopersonal, idadmin]);
            return resultado.rows.length > 0;
        }catch(error) {
            console.log('Error al verificar el administrador en la base de datos', error)
        }
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