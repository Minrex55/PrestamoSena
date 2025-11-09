import LoginSuperPorteroModelo from '../../modelo/superportero/LoginSuperPorteroModelo.js';

class LoginSuperPorteroControlador {
  async login(req, res) {
    const { correopersonal, contrasena } = req.body;

    try {
      const superportero = await LoginSuperPorteroModelo.login(correopersonal, contrasena);
      return res.status(200).json({
        mensaje: 'Inicio de sesión exitoso',
        superportero
      });
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  }
}

export default new LoginSuperPorteroControlador();