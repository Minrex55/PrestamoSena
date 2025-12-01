import LoginInvitadoModelo from '../../modelo/Invitado/LoginInvitadoModelo.js';
import JwtConfig from '../../config/JwtConfig.js'; // ← AGREGAR ESTA LÍNEA

class LoginInvitadoControlador {
  constructor() {
    if (LoginInvitadoControlador.instance) {
      return LoginInvitadoControlador.instance;
    }
    LoginInvitadoControlador.instance = this;
  }

  async login(req, res) {
    const { correopersonal, contrasena } = req.body;
    try {
      const Invitado = await LoginInvitadoModelo.login(correopersonal, contrasena);
      
      
      const token = JwtConfig.generarToken({
        id: Invitado._id || Invitado.id || Invitado.documento,
        email: Invitado.correopersonal,
        rol: 'Invitado',
        nombre: Invitado.nombres
      });
      
      
      return res.status(200).json({
        mensaje: 'Inicio de sesión exitoso',
        token, 
        Invitado
      });
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  }
}

export default new LoginInvitadoControlador();