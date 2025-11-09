import dotenv from 'dotenv';
dotenv.config();

class Config {
  constructor() {
    if (Config.instance) {
      return Config.instance; // Devuelve la instancia existente si ya fue creada
    }

    // Asignamos las variables de entorno al objeto de configuración
    this.DB_HOST = process.env.DB_HOST;
    this.DB_USER = process.env.DB_USER;
    this.DB_PASSWORD = process.env.DB_PASSWORD;
    this.DB_NAME = process.env.DB_NAME;
    this.DB_PORT = parseInt(process.env.DB_PORT, 10) || 5432;
    this.PORT = parseInt(process.env.PORT, 10) || 3000;

    // Hacemos que la instancia sea única
    Config.instance = this;
  }

  // Método para obtener la configuración
  getConfig() {
    return {
      DB_HOST: this.DB_HOST,
      DB_USER: this.DB_USER,
      DB_PASSWORD: this.DB_PASSWORD,
      DB_NAME: this.DB_NAME,
      DB_PORT: this.DB_PORT,
      PORT: this.PORT
    };
  }
}

// Exportamos la instancia Singleton de Config
export default new Config();