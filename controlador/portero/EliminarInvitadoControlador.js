import EliminarInvitadoModelo from '../../modelo/portero/EliminarInvitadoModelo.js';

class EliminarInvitadoControlador {
  async eliminarInvitado(req, res) {
    const { id } = req.params;

    try {
      const invitadoEliminado = await EliminarInvitadoModelo.eliminarInvitado(id);

      if (!invitadoEliminado) {
        return res.status(404).json({ mensaje: 'Invitado no encontrado.' });
      }

      return res.status(200).json({
        mensaje: 'Invitado eliminado correctamente.',
        invitadoEliminado
      });
    } catch (error) {
      console.error('Error en el controlador al eliminar:', error);
      return res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
  }
}

export default new EliminarInvitadoControlador();
