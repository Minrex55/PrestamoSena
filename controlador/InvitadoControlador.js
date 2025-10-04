const InvitadoModelo = require('../modelo/InvitadoModelo');

class InvitadoControlador {
  /*Buscar invitado por ID*/
  async buscarPorId(req, res) {
    try {
      const invitado = await InvitadoModelo.buscarPorId(req.params.id);
      if (!invitado) return res.status(404).json({ error: 'Invitado no encontrado' });
      res.json(invitado);
    } catch (err) {
      console.error('❌ Error en InvitadoControlador.buscarPorId:', err.message);
      res.status(500).json({ error: 'Error al buscar invitado' });
    }
  }

  /*Buscar invitado por nombre*/
  async buscarPorNombres(req, res) {
    try {
      const invitado = await InvitadoModelo.buscarPorNombres(req.params.nombres);
      if (!invitado) return res.status(404).json({ error: 'Invitado no encontrado' });
      res.json(invitado);
    } catch (err) {
      console.error('❌ Error en InvitadoControlador.buscarPorNombres:', err.message);
      res.status(500).json({ error: 'Error al buscar invitado' });
    }
  }

  /*Buscar invitado por documento*/
  async buscarPorDocumento(req, res) {
    try {
      const invitado = await InvitadoModelo.buscarPorDocumento(req.params.documento);
      if (!invitado) return res.status(404).json({ error: 'Invitado no encontrado' });
      res.json(invitado);
    } catch (err) {
      console.error('❌ Error en InvitadoControlador.buscarPorDocumento:', err.message);
      res.status(500).json({ error: 'Error al buscar invitado' });
    }
  }

  /*Listar todos los invitados*/
  async listarTodos(req, res) {
    try {
      const invitados = await InvitadoModelo.listarTodos();
      res.json(invitados);
    } catch (err) {
      console.error('❌ Error en InvitadoControlador.listarTodos:', err.message);
      res.status(500).json({ error: 'Error al listar invitados' });
    }
  }
}

module.exports = new InvitadoControlador();
