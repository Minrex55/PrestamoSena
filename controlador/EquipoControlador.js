const EquipoModelo = require('../modelo/EquipoModelo');

class EquipoControlador {
  /**
   * Buscar equipo por ID
   */
  async buscarPorId(req, res) {
    try {
      const equipo = await EquipoModelo.buscarPorId(req.params.id);
      if (!equipo) return res.status(404).json({ error: 'Equipo no encontrado' });
      res.json(equipo);
    } catch (err) {
      console.error('❌ Error en EquipoControlador.buscarPorId:', err.message);
      res.status(500).json({ error: 'Error al buscar equipo' });
    }
  }

  /**
   * Buscar equipo por Modelo
   */
  async buscarPorModelo(req, res) {
    try {
      const equipo = await EquipoModelo.buscarPorModelo(req.params.modelo);
      if (!equipo) return res.status(404).json({ error: 'Equipo no encontrado' });
      res.json(equipo);
    } catch (err) {
      console.error('❌ Error en EquipoControlador.buscarPorModelo:', err.message);
      res.status(500).json({ error: 'Error al buscar equipo' });
    }
  }

  /**
   * Buscar equipo por serial
   */
  async buscarPorSerial(req, res) {
    try {
      const equipo = await EquipoModelo.buscarPorSerial(req.params.serial);
      if (!equipo) return res.status(404).json({ error: 'Equipo no encontrado' });
      res.json(equipo);
    } catch (err) {
      console.error('❌ Error en EquipoControlador.buscarPorSerial:', err.message);
      res.status(500).json({ error: 'Error al buscar equipo' });
    }
  }

  /**
   * Listar todos los equipos
   */
  async listarTodos(req, res) {
    try {
      const equipos = await EquipoModelo.listarTodos();
      res.json(equipos);
    } catch (err) {
      console.error('❌ Error en EquipoControlador.listarTodos:', err.message);
      res.status(500).json({ error: 'Error al listar equipos' });
    }
  }
}

module.exports = new EquipoControlador();
