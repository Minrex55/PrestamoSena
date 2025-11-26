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

    if (!documento || !nombres || !telefono || !correopersonal || !contrasena) {
      return res.status(400).json({
        error: 'Los campos documento, nombres, correo y contraseña son obligatorios.'
      });
    }

    const validacionAdministrador = await CrearAdministradorModelo.validacionAdministrador(documento, telefono, correopersonal);
      if (validacionAdministrador) {
          return res.status(409).json({mensaje: 'El administrador con ese documento, correo o telefono ya existe'})
      }

    try {
      const AdministradorCreado = await CrearAdministradorModelo.crearAdministrador({documento,nombres,telefono,correopersonal,contrasena});
      const { contrasena: _, ...AdministradorSeguro } = AdministradorCreado;

      return res.status(201).json({
        mensaje: 'Administrador creado exitosamente',
        Administrador: AdministradorSeguro
      });

    } catch (error) {
      console.error('Error en crear Administrador:', error);
      return res.status(500).json({
        error: 'Error interno al crear el Administrador.'
      });
    }
  }
}

export default new CrearAdministradorControlador();