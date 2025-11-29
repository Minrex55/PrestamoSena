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

      if (!modelo?.trim() || !numerodeserie?.trim() || !idinvitado?.trim()) {
        return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
      }       

      const validacionModelo = /^[A-Za-z0-9\-_ ]{10,30}$/;
      if (!validacionModelo.test(modelo.trim())) {
        return res.status(400).json({ mensaje: 'El modelo debe tener entre 10 y 30 caracteres' });
      }

      const validacionNumeroSerie = /^[A-Za-z0-9-]{8,15}$/;
      if (!validacionNumeroSerie.test(numerodeserie.trim())) {
        return res.status(400).json({ mensaje: 'El número de serie debe tener entre 8 y 15 caracteres' });
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