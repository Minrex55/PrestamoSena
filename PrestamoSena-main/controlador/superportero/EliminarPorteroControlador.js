import EliminarPorteroModelo from '../../modelo/superportero/EliminarPorteroModelo.js';

class EliminarPorteroControlador {
  // Método para eliminar un portero existente
  async eliminarPortero(req, res) {
    const { id } = req.params;

    try {
      const resultado = await EliminarPorteroModelo.eliminarPortero(id);
      if (resultado.rowCount === 0) {
        return res.status(404).json({
          error: 'Portero no encontrado.'
        });
      }

      return res.status(200).json({
        mensaje: 'Portero eliminado exitosamente'
      });

    } catch (error) {
      console.error('Error en eliminarPortero:', error);
      return res.status(500).json({
        error: 'Error interno al eliminar el portero.'
      });
    }
  }
}

// Exportamos una instancia única del controlador 
export default new EliminarPorteroControlador();