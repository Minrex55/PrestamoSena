import EliminarEquipoModelo from '../../modelo/Portero/EliminarEquipoModelo.js';

class EliminarEquipoControlador {
  constructor() {
    if (EliminarEquipoControlador.instance) {
      return EliminarEquipoControlador.instance
    }
    EliminarEquipoControlador.instance = this;
  }

  async eliminarEquipo(req, res) {
    const {idequipo}  = req.params
    
    try { 
      const equipoEliminado = await EliminarEquipoModelo.eliminarEquipo(idequipo)

      if (!equipoEliminado) {
        return res.status(404).json({ 
          mensaje: 'Equipo no encontrado.',
          equipoEliminado
        });
      }

      return res.status(200).json({mensaje: 'Equipo eliminado correctamente'})

    }catch(error) {
      console.error('Error al eliminar el equipo', error);
      return res.status(500).json({ 
        mensaje: 'Error interno al eliminar el equipo' 
      });
    }
  }
}

export default  new EliminarEquipoControlador();