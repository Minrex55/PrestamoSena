import buscarEquipoModelo from '../../modelo/portero/BuscarEquipoModelo.js';

class BuscarEquipoControlador {
  async buscarEquipoPorId(req, res) {
    const { id } = req.params;
    try {
      const equipo = await buscarEquipoModelo.buscarPorId(id);
      if (!equipo) {
        return res.status(404).json({ mensaje: 'Equipo no encontrado' });
      }
      res.json(equipo);
    } catch (error) {
      console.error('Error al buscar el equipo por ID:', error);
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  }

  async buscarEquipoPorModelo(req, res) {
    const { modelo } = req.params;
    try {
      const equipos = await buscarEquipoModelo.buscarPorModelo(modelo);
      if (!equipos || equipos.length === 0) {
        return res.status(404).json({ mensaje: 'No se encontraron equipos para el modelo especificado' });
      }
      res.json(equipos);
    } catch (error) {
      console.error('Error al buscar equipos por modelo:', error);
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  }

  async buscarEquipoPorSerial(req, res) {
    const { serial } = req.params;
    try {
      const equipos = await buscarEquipoModelo.buscarPorSerial(serial);
      if (!equipos || equipos.length === 0) {
        return res.status(404).json({ mensaje: 'No se encontraron equipos para el serial especificado' });
      }
      res.json(equipos);
    } catch (error) {
      console.error('Error al buscar equipos por serial:', error);
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  }

  async listarTodosLosEquipos(req, res) {
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
