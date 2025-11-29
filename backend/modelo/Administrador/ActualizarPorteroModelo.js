import Conexion from "../bd/Conexion.js";

class ActualizarPorteroModelo {
    constructor(){
        if (ActualizarPorteroModelo.instance){
            return ActualizarPorteroModelo.instance
        }

        this.db = Conexion
        ActualizarPorteroModelo.instance = this
    }

    async validacionPortero(documento, telefono, correopersonal) {
        const query = `SELECT * FROM portero WHERE documento = $1 OR correopersonal = $2 OR telefono = $3;`;

        try {
            const resultado = await this.db.query(query, [documento, correopersonal, telefono]);
            return resultado.rows.length > 0;
        }catch(error) {
            console.log('Error al verificar el portero en la base de datos', error)
        }
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