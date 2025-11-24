import { Pool } from "pg";
import Config from "./Config.js";

class Conexion {
    constructor() {
        if (Conexion.instance) {
            return Conexion.instance;
        }

        //Configuracion de la conexion a PostgreSQL
        this.pool = new Pool({
            host: Config.DB_HOST,
            user: Config.DB_USER,
            database: Config.DB_NAME,
            password: Config.DB_PASSWORD,
            port: Config.DB_PORT,
            max: 10,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000
        });

        this.pool.connect()
            .then(client => {
                console.log('Conexion a PostgreSQL exitosa')
                client.release();
            })
            .catch(error => {
                console.error('Error al conectar a PostgreSQL', error.message);
            });

            Conexion.instance = this;
    }

    query(text,  params) {
        return this.pool.query(text, params);
    }
}

export default new Conexion();