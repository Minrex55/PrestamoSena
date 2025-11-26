import Conexion from "../bd/Conexion.js";

class ActualizarPorteroModelo {
    constructor(){
        if (ActualizarPorteroModelo.instance){
            return ActualizarPorteroModelo.instance
        }

        this.db = Conexion
        ActualizarPorteroModelo.instance = this
    }

    async actualizarPortero(idportero, portero) {
        const {documento, nombres, telefono, correopersonal, contrasena} = portero;
        
        const query = `UPDATE portero SET documento = $1, nombres =  $2, telefono = $3, correopersonal = $4, contrasena = $5 WHERE idportero = $6 RETURNING *`;

        const valores = [documento, nombres, telefono, correopersonal, contrasena, idportero];
        try {
            const resultado = await this.db.query(query, valores);
            return resultado.rows[0];
        }catch(error) {
            console.error("Error al actualizar portero", error);
            throw error;
        }
    }
}

export default new ActualizarPorteroModelo();