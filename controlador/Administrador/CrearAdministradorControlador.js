import CrearAdministradorModelo from '../../modelo/Administrador/CrearAdministradorModelo.js';

class CrearAdministradorControlador {
    constructor() {
        if (CrearAdministradorControlador.instance) {
          return CrearAdministradorControlador.instance;
        }
        CrearAdministradorControlador.instance = this;
    }

    async crearAdministrador(req, res) {
    const { t1: documento, t2: nombres, t3: telefono, t4: correopersonal, t5: contrasena } = req.body;

    // Validación básica (puedes mejorarla)
    if (!documento || !nombres || !telefono || !correopersonal || !contrasena) {
      return res.status(400).json({
        error: 'Los campos documento, nombres, correo y contraseña son obligatorios.'
      });
    }

    try {
      // Llama al método estático del modelo para crear el Administrador (con bcrypt)
      const AdministradorCreado = await CrearAdministradorModelo.crearAdministrador({documento,nombres,telefono,correopersonal,contrasena});

      // Eliminamos la contraseña del objeto antes de enviarlo (buena práctica)
      const { contrasena: _, ...AdministradorSeguro } = AdministradorCreado;

      return res.status(201).json({
        mensaje: 'Administrador creado exitosamente',
        Administrador: AdministradorSeguro
      });

    } catch (error) {
      // Detectar errores comunes (ej. violación de unicidad)
      if (error.message.includes('duplicate key') || error.message.includes('llave duplicada')) {
        return res.status(409).json({
          error: 'El documento, telefono o correo ya están registrados.'
        });
      }

      console.error('Error en crear Administrador:', error);
      return res.status(500).json({
        error: 'Error interno al crear el Administrador.'
      });
    }
  }

}

export default new CrearAdministradorControlador();