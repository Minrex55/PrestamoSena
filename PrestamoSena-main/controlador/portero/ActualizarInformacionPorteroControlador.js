import ActualizarInformacionPorteroModelo from '../../modelo/portero/ActualizarInformacionPorteroModelo.js';

class ActualizarInformacionPorteroControlador {
  // Método para actualizar la información del portero
  async actualizarInformacion(req, res) {
    const { id } = req.params;
    const { correopersonal, contrasena } = req.body;

    // Validación básica
    if (!correopersonal || !contrasena) {
      return res.status(400).json({
        error: 'Los campos correo y contraseña son obligatorios.'
      });
    }
    try {
      const datosActualizados = { correopersonal, contrasena };
      const porteroActualizado = await ActualizarInformacionPorteroModelo.actualizarPorId(id, datosActualizados);

      if (!porteroActualizado) {
        return res.status(404).json({ error: 'Portero no encontrado.' });
      }

      return res.status(200).json({
        message: 'Información del portero actualizada correctamente.',
        portero: porteroActualizado
      });
    } catch (error) {
      console.error('Error en actualizarInformacion:', error);
      return res.status(500).json({ error: 'Error interno al actualizar la información del portero.' });
    }
  }
}

export default new ActualizarInformacionPorteroControlador();