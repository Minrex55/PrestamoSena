import EliminarAdministradorModelo from '../../modelo/Administrador/EliminarAdministradorModelo.js';

class EliminarAdministradorControlador {
  constructor() {
    if (EliminarAdministradorControlador.instance) {
      return EliminarAdministradorControlador.instance;
    }
  
    EliminarAdministradorControlador.instance = this;
  }
  // Método para eliminar un portero existente
  async eliminarAdministrador(req, res) {
    const { idadmin } = req.params;

    try {
      const resultado = await EliminarAdministradorModelo.eliminarAdministrador(idadmin);
      if (!resultado) {
        return res.status(404).json({
          error: 'Administrador no encontrado.'
        });
      }

      return res.status(200).json({
        resultado
      });

    } catch (error) {
      console.error('Error en eliminarAdministrador:', error);
      return res.status(500).json({
        error: error.message || 'Error al eliminar el Administrador.'
      });
    }
  }
}

// Exportamos una instancia única del controlador 
export default new EliminarAdministradorControlador();