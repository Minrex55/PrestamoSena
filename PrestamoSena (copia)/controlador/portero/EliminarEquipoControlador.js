import EliminarEquipoModelo from '../../modelo/portero/EliminarEquipoModelo.js';

class EliminarEquipoControlador {
  async eliminarEquipo(req, res) {
    const { id } = req.params;

    try {
      const equipoEliminado = await EliminarEquipoModelo.eliminarEquipo(id);

      if (!equipoEliminado) {
        return res.status(404).json({ mensaje: 'Equipo no encontrado.' });
      }

      return res.status(200).json({
        mensaje: 'Equipo eliminado correctamente.',
        equipoEliminado
      });
    } catch (error) {
      console.error('Error en el controlador al eliminar:', error);
      return res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
  }
}

export default new EliminarEquipoControlador();
