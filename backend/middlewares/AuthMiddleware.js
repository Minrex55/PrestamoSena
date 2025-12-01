import JwtConfig from '../config/JwtConfig.js';

class AuthMiddleware {
  constructor() {
    if (AuthMiddleware.instance) {
      return AuthMiddleware.instance;
    }
    AuthMiddleware.instance = this;
  }

  autenticar(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
          error: 'No autorizado - Token no proporcionado' 
        });
      }

      const token = authHeader.split(' ')[1];
      const decoded = JwtConfig.verificarToken(token);
      
      // Guardar datos del usuario en la request
      req.usuario = decoded;
      
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expirado' });
      }
      return res.status(401).json({ error: 'Token inválido' });
    }
  }
}

export default new AuthMiddleware();