import EditarEquipoModelo from '../../modelo/portero/EditarEquipoModelo.js';

class EditarEquipoControlador {
  async editarEquipo(req, res) {
    const { id } = req.params;
    const datos = req.body; // puede incluir modelo, serial, estado, etc.

    try {
      const equipoActualizado = await EditarEquipoModelo.editarEquipo(id, datos);

      if (!equipoActualizado) {
        return res.status(404).json({ mensaje: 'Equipo no encontrado.' });
      }

      return res.status(200).json({
        mensaje: 'Equipo actualizado correctamente.',
        equipo: equipoActualizado
      });
    } catch (error) {
      console.error('Error al actualizar el equipo:', error);
      return res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
  }
}

export default new EditarEquipoControlador();
