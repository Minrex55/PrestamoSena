const { Pool } = require('pg');
const Config = require('./Config');

const pool = new Pool({
    host: Config.DB_HOST,
    user: Config.DB_USER,
    password: Config.DB_PASSWORD,
    database: Config.DB_NAME,
    port: Config.DB_PORT,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});

pool.connect()
.then(client =>{
    console.log('Conexion a PostgreSQL exitosa');
    client.release();
})

.catch(err =>{
    console.error('Error al conectar a PostgreSQL:', err.message);
});

module.exports = {
    query: (test, params) => pool.query(test, params),
};