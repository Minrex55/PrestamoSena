import CrearEquipoModelo from '../../modelo/Portero/CrearEquipoModelo.js';

class CrearEquipoControlador{
    constructor() {
      if (CrearEquipoControlador.instance) {
        return CrearEquipoControlador.instance
      }
      CrearEquipoControlador.instance = this;
    }

    async crearEquipo(req, res) {
      const {t1: modelo, t2: numerodeserie, t3: idinvitado} = req.body

      if (!modelo || !numerodeserie || !idinvitado) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
    }

    const validacionEquipo = await CrearEquipoModelo.validacionEquipo(numerodeserie);
      if (validacionEquipo) {
          return res.status(409).json({mensaje: 'El equipo con ese numero de serie ya existe'})
      }

    try {
      const nuevoEquipo = await CrearEquipoModelo.crearEquipo({ modelo, numerodeserie, idinvitado });

      return res.status(201).json({
        mensaje: 'Equipo creado correctamente.',
        nuevoEquipo
      });

    } catch (error) {
      console.error('Error al crear el equipo:', error);
      return res.status(500).json({ mensaje: 'Error interno al crear el equipo'});
    }
  }
}

export default new CrearEquipoControlador();