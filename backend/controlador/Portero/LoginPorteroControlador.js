import LoginPorteroModelo from '../../modelo/Portero/LoginPorteroModelo.js';
import JwtConfig from '../../config/JwtConfig.js'; // ← AGREGAR ESTA LÍNEA

class LoginPorteroControlador {
  constructor() {
    if (LoginPorteroControlador.instance) {
      return LoginPorteroControlador.instance;
    }
    LoginPorteroControlador.instance = this;
  }

  async login(req, res) {
    const { t1: correopersonal, t2: contrasena } = req.body;
    try {
      const Portero = await LoginPorteroModelo.login(correopersonal, contrasena);
      
      
      const token = JwtConfig.generarToken({
        id: Portero._id || Portero.id || Portero.documento,
        email: Portero.correopersonal,
        rol: 'Portero',
        nombre: Portero.nombres
      });
      
      
      return res.status(200).json({
        mensaje: 'Inicio de sesión exitoso',
        token, 
        Portero
      });
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  }
}

export default new LoginPorteroControlador();
