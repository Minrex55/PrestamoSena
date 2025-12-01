import LoginAdministradorModelo from '../../modelo/Administrador/LoginAdministradorModelo.js';
import JwtConfig from '../../config/JwtConfig.js'; // ← AGREGAR ESTA LÍNEA

class LoginAdministradorControlador {
  constructor() {
    if (LoginAdministradorControlador.instance) {
      return LoginAdministradorControlador.instance;
    }
    LoginAdministradorControlador.instance = this;
  }

  async login(req, res) {
    const { correopersonal, contrasena } = req.body;
    try {
      const Administrador = await LoginAdministradorModelo.login(correopersonal, contrasena);
      
      //(Generación del token)
      const token = JwtConfig.generarToken({
        id: Administrador._id || Administrador.id || Administrador.documento,
        email: Administrador.correopersonal,
        rol: 'Administrador',
        nombre: Administrador.nombres
      });
      
      
      return res.status(200).json({
        mensaje: 'Inicio de sesión exitoso',
        token, // (devolver el token)
        Administrador
      });
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  }
}

export default new LoginAdministradorControlador();