import EliminarInvitadoModelo from '../../modelo/Portero/EliminarInvitadoModelo.js';

class EliminarInvitadoControlador {
  constructor() {
    if (EliminarInvitadoControlador.instance) {
      return EliminarInvitadoControlador.instance
    }
    EliminarInvitadoControlador.instance = this;
  }

  async eliminarInvitado(req, res) {
    const {idinvitado} = req.params

    try  {
      const invitadoEliminado = await EliminarInvitadoModelo.eliminarInvitado(idinvitado)

      if (!invitadoEliminado) {
        return res.status(404).json({ mensaje: 'Invitado no encontrado.' });
      }

      return res.status(200).json({
        mensaje: 'Invitado eliminado correctamente',
        invitadoEliminado
      });

    }catch(error) {
      console.error('Error al eliminar el invitado', error);
      return res.status(500).json({ 
        mensaje: 'Error interno al eliminar el equipo' 
      });
    }
  }
}

export default new EliminarInvitadoControlador();