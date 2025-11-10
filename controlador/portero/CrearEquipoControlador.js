import CrearEquipoModelo from '../../modelo/portero/CrearEquipoModelo.js';

class CrearEquipoControlador {
  async crearEquipo(req, res) {
    const { serial, modelo, idinvitado } = req.body;

    if (!serial || !modelo || !idinvitado) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
    }

    try {
      const nuevoEquipo = await CrearEquipoModelo.crear({ serial, modelo, idinvitado });
      return res.status(201).json({
        mensaje: 'Equipo creado correctamente.',
        equipo: nuevoEquipo
      });
    } catch (error) {
      console.error('Error al crear el equipo:', error.message);
      return res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
  }
}

export default new CrearEquipoControlador();
