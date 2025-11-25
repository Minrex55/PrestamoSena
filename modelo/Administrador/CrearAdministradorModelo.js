import Conexion from "../bd/Conexion.js";

class CrearAdministradorModelo {
    constructor(){
        if (CrearAdministradorModelo.instance) {
            return CrearAdministradorModelo.instance
        }

        this.db = Conexion;
        CrearAdministradorModelo.instance =  this;
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