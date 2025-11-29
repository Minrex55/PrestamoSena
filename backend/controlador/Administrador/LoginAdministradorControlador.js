import LoginAdministradorModelo from '../../modelo/Administrador/LoginAdministradorModelo.js';

class LoginAdministradorControlador {
  async login(req, res) {
    const { correopersonal, contrasena } = req.body;

    try {
      const Administrador = await LoginAdministradorModelo.login(correopersonal, contrasena);
      return res.status(200).json({
        mensaje: 'Inicio de sesión exitoso',
        Administrador
      });
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  }
}

export default new LoginAdministradorControlador();