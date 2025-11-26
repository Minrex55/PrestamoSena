import CrearPorteroModelo from '../../modelo/Administrador/CrearPorteroModelo.js';

class CrearPorteroControlador {
    constructor() {
      if (CrearPorteroControlador.instance) {
        return CrearPorteroControlador.instance;
    }
    CrearPorteroControlador.instance = this;
  }

  async crearPortero(req, res) {
    const { t1: documento, t2: nombres, t3: telefono, t4: correopersonal, t5: contrasena } = req.body;

    // Validación básica (puedes mejorarla)
    if (!documento || !nombres || !telefono || !correopersonal || !contrasena) {
      return res.status(400).json({
        error: 'Los campos documento, nombres, correo y contraseña son obligatorios.'
      });
    }

    try {
      // Llama al método estático del modelo para crear el portero (con bcrypt)
      const porteroCreado = await CrearPorteroModelo.crearPortero({documento,nombres,telefono,correopersonal,contrasena});

      // Eliminamos la contraseña del objeto antes de enviarlo (buena práctica)
      const { contrasena: _, ...porteroSeguro } = porteroCreado;

      return res.status(201).json({
        mensaje: 'Portero creado exitosamente',
        portero: porteroSeguro
      });

    } catch (error) {
      // Detectar errores comunes (ej. violación de unicidad)
      // Cambiar esta validacion
      if (error.message.includes('duplicate key') || error.message.includes('llave duplicada')) {
        return res.status(409).json({
          error: 'El documento, telefono o correo ya están registrados.'
        });
      }

      console.error('Error en crearPortero:', error);
      return res.status(500).json({
        error: 'Error interno al crear el portero.'
      });
    }
  }
}

export default new CrearPorteroControlador();