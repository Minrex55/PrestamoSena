import jwt from 'jsonwebtoken';

class JwtConfig {
  constructor() {
    if (JwtConfig.instance) {
      return JwtConfig.instance;
    }
    this.secret = process.env.JWT_SECRET || 'cambiar_en_produccion_clave_super_segura';
    this.expiresIn = '24h';
    JwtConfig.instance = this;
  }

  generarToken(payload) {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verificarToken(token) {
    return jwt.verify(token, this.secret);
  }
}

export default new JwtConfig();