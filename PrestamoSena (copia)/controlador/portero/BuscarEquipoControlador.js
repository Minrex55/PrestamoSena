import BuscarEquipoModelo from '../../modelo/portero/BuscarEquipoModelo.js';

class BuscarEquipoControlador {
  // Método para buscar un equipo por id 
  async buscarEquipoPorId(req, res) {
    const { id } = req.params; // Obtener el id desde los parámetros de la solicitud
    const buscarEquipoModelo = new BuscarEquipoModelo();
    try {
      const equipo = await buscarEquipoModelo.buscarporId(id);
      if (equipo.length === 0) {
        return res.status(404).json({ mensaje: 'Equipo no encontrado' });
      }
      res.json(equipo);
    } catch (error) {
      console.error('Error al buscar el equipo:', error);
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  }

  // Método para mostrar por modelo
  async buscarEquipoPorModelo(req, res) {
    const { modelo } = req.params; // Obtener el modelo desde los parámetros de la solicitud
    const buscarEquipoModelo = new BuscarEquipoModelo();
    try {
      const equipos = await buscarEquipoModelo.buscarPorModelo(modelo);
      if (equipos.length === 0) {
        return res.status(404).json({ mensaje: 'No se encontraron equipos para el modelo especificado' });
      }
      res.json(equipos);
    } catch (error) {
      console.error('Error al buscar equipos por modelo:', error);
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
    }
    // Método para mostrar por serial
    async buscarEquipoPorSerial(req, res) {
      const { serial } = req.params; // Obtener el serial desde los parámetros de la solicitud
      const buscarEquipoModelo = new BuscarEquipoModelo();
      try {
        const equipo = await buscarEquipoModelo.buscarPorSerial(serial);
        if (equipo.length === 0) {
          return res.status(404).json({ mensaje: 'Equipo no encontrado para el serial especificado' });
        }
        res.json(equipo);
      } catch (error) {
        console.error('Error al buscar equipo por serial:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
      }
    }

    // Método para listar todos los equipos
    async listarTodosLosEquipos(req, res) {
      const buscarEquipoModelo = new BuscarEquipoModelo();
      try {
        const equipos = await buscarEquipoModelo.listarTodos();
        res.json(equipos);
      } catch (error) {
        console.error('Error al listar todos los equipos:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
      }
}
}

export default new BuscarEquipoControlador();