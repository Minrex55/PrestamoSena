import Conexion from "../bd/Conexion.js";

class CrearPorteroModelo {
    constructor(){
        if (CrearPorteroModelo.instance) {
            return CrearPorteroModelo.instance
        }

        this.db = Conexion;
        CrearPorteroModelo.instance =  this;
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

    async crearPortero(portero) {
        const {documento,nombres,telefono,correopersonal,contrasena} = portero

        const query = `INSERT INTO portero (documento, nombres, telefono, correopersonal, contrasena)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;`;

        const valores = [
            documento, nombres, telefono, correopersonal, contrasena
        ];

        try{
            const resultado = await this.db.query(query, valores);
            return resultado.rows[0];
        }catch(error){
            console.log('Error al crear Portero')
            throw error;
        }
    }
}

export default new CrearPorteroModelo();