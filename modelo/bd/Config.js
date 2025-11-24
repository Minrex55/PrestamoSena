import { config as dotenvConfig } from "dotenv";

dotenvConfig();

class Config {
    constructor() {
        if (Config.instance) {
            return Config.instance;
        }

        // Asignación de las variables del entorno
        this.DB_HOST = process.env.DB_HOST;
        this.DB_USER = process.env.DB_USER;
        this.DB_NAME = process.env.DB_NAME;
        this.DB_PASSWORD = process.env.DB_PASSWORD;
        this.DB_PORT = parseInt(process.env.DB_PORT, 10) || 5432;
        this.PORT = parseInt(process.env.PORT, 10) || 3000;

        Config.instance = this;
    }

    getConfig() {
        return {
            DB_HOST: this.DB_HOST,
            DB_USER: this.DB_USER,
            DB_NAME: this.DB_NAME,
            DB_PASSWORD: this.DB_PASSWORD,
            DB_PORT: this.DB_PORT,
            PORT: this.PORT
        };
    }
}

export default new Config();