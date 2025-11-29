import Conexion from "../bd/Conexion.js";

class CrearAdministradorModelo {
    constructor(){
        if (CrearAdministradorModelo.instance) {
            return CrearAdministradorModelo.instance
        }

        this.db = Conexion;
        CrearAdministradorModelo.instance =  this;
    }

    async validacionAdministrador(documento, telefono, correopersonal) {
        const query = `SELECT * FROM administrador WHERE documento = $1 OR correopersonal = $2 OR telefono = $3;`;

        try {
            const resultado = await this.db.query(query, [documento, correopersonal, telefono]);
            return resultado.rows.length > 0;
        }catch(error) {
            console.log('Error al verificar el administrador en la base de datos', error)
        }
    }

    async crearAdministrador(administrador) {
        const {documento,nombres,telefono,correopersonal,contrasena,} = administrador

        const query = `INSERT INTO administrador (documento, nombres, telefono, correopersonal, contrasena)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;`;

        const valores = [
            documento, nombres, telefono, correopersonal, contrasena
        ];

        try{
            const resultado = await this.db.query(query, valores);
            return resultado.rows[0];
        }catch(error){
            console.log('Error al crear Administrador')
            throw error;
        }
    }
}

export default new CrearAdministradorModelo();