import BuscarInvitadoModelo from '../../modelo/portero/BuscarInvitadoModelo.js';

class BuscarInvitadoControlador {
  async buscarPorId(req, res) {
    const { id } = req.params;
    try {
      const invitado = await BuscarInvitadoModelo.buscarPorId(id);
      if (!invitado) {
        return res.status(404).json({ error: 'Invitado no encontrado' });
      }
      return res.status(200).json(invitado);
    } catch (error) {
      console.error('Error en buscarPorId:', error);
      return res.status(500).json({ error: 'Error interno al buscar el invitado' });
    }
  }

    async buscarPorNombre(req, res) {
    const { nombre } = req.params;
    try {
      const invitados = await BuscarInvitadoModelo.buscarPorNombre(nombre);
      return res.status(200).json(invitados);
    } catch (error) {
      console.error('Error en buscarPorNombre:', error);
      return res.status(500).json({ error: 'Error interno al buscar el invitado' });
    }
  }

    async buscarPorDocumento(req, res) {
    const { documento } = req.params;
    try {
      const invitado = await BuscarInvitadoModelo.buscarPorDocumento(documento);
      if (!invitado) {
        return res.status(404).json({ error: 'Invitado no encontrado' });
      }
      return res.status(200).json(invitado);
    } catch (error) {
      console.error('Error en buscarPorDocumento:', error);
      return res.status(500).json({ error: 'Error interno al buscar el invitado' });
    }
  }

  async listarTodos(req, res) {
    try {
      const invitados = await BuscarInvitadoModelo.listarTodos();
      return res.status(200).json(invitados);
    } catch (error) {
      console.error('Error en listarTodos:', error);
      return res.status(500).json({ error: 'Error interno al listar los invitados' });
    }
  }
}

export default new BuscarInvitadoControlador();
