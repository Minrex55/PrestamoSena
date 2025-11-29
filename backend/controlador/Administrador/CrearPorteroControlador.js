import CrearPorteroModelo from '../../modelo/Administrador/CrearPorteroModelo.js';
import bcrypt from "bcrypt"

class CrearPorteroControlador {
    constructor() {
      if (CrearPorteroControlador.instance) {
        return CrearPorteroControlador.instance;
    }
    CrearPorteroControlador.instance = this;
  }

  async crearPortero(req, res) {
    const { t1: documento, t2: nombres, t3: telefono, t4: correopersonal, t5: contrasena } = req.body;

    if (!documento || !nombres || !telefono || !correopersonal || !contrasena) {
      return res.status(400).json({
        error: 'Los campos documento, nombres, correo y contraseña son obligatorios.'
      });
    }

    const validacionPortero = await CrearPorteroModelo.validacionPortero(documento, telefono, correopersonal);
          if (validacionPortero) {
              return res.status(409).json({mensaje: 'El portero con ese documento, correo o telefono ya existe'})
          }

    try {
      const saltRounds = 10;
      const hash = await bcrypt.hash(contrasena, saltRounds);
      const portero = { 
        documento, 
        nombres, 
        telefono, 
        correopersonal, 
        contrasena: hash 
      };
      const porteroCreado = await CrearPorteroModelo.crearPortero(portero);
      const { contrasena: _, ...porteroSeguro } = porteroCreado;

      return res.status(201).json({
        mensaje: 'Portero creado exitosamente',
        portero: porteroSeguro
      });

    } catch (error) {
      console.error('Error en crearPortero:', error);
      return res.status(500).json({
        error: 'Error interno al crear el portero.'
      });
    }
  }
}

export default new CrearPorteroControlador();