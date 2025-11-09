import LoginPorteroModelo from '../../modelo/portero/LoginPorteroModelo.js';

class LoginPorteroControlador {
  async login(req, res) {
    const { correopersonal, contrasena } = req.body;

    try {
      const portero = await LoginPorteroModelo.login(correopersonal, contrasena);
      return res.status(200).json({
        mensaje: 'Inicio de sesión exitoso',
        portero
      });
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  }
}

export default new LoginPorteroControlador();