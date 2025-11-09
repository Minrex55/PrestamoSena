import EliminarSuperPorteroModelo from '../../modelo/superportero/EliminarSuperPorteroModelo.js';

class EliminarSuperPorteroControlador {
  // Método para eliminar un portero existente
  async eliminarSuperPortero(req, res) {
    const { id } = req.params;

    try {
      const resultado = await EliminarSuperPorteroModelo.eliminarSuperPortero(id);
      if (resultado.rowCount === 0) {
        return res.status(404).json({
          error: 'SuperPortero no encontrado.'
        });
      }

      return res.status(200).json({
        mensaje: 'SuperPortero eliminado exitosamente'
      });

    } catch (error) {
      console.error('Error en eliminarSuperPortero:', error);
      return res.status(500).json({
        error: 'Error interno al eliminar el SuperPortero.'
      });
    }
  }
}

// Exportamos una instancia única del controlador 
export default new EliminarSuperPorteroControlador();