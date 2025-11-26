import EliminarPorteroModelo from '../../modelo/Administrador/EliminarPorteroModelo.js';

class EliminarPorteroControlador {
  constructor() {
    if (EliminarPorteroControlador.instance) {
      return EliminarPorteroControlador.instance;
    }
    EliminarPorteroControlador.instance = this;
  }

  // Método para eliminar un portero existente

  async eliminarPortero(req, res) {
      const { idportero } = req.params;

      try {
        const resultado = await EliminarPorteroModelo.eliminarPortero(idportero);
        if (resultado.rowCount === 0) {
          return res.status(404).json({
          error: 'Portero no encontrado.'
        });
      }

      return res.status(200).json({
        resultado
      });

    } catch (error) {
      console.error('Error en eliminarPortero:', error);
      return res.status(500).json({
        error: error.message || 'Error al eliminar el portero.'
      });
    }
  }

}

export default new EliminarPorteroControlador();