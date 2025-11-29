import CrearAdministradorModelo from '../../modelo/Administrador/CrearAdministradorModelo.js';
import bcrypt from "bcrypt"

class CrearAdministradorControlador {
    constructor() {
        if (CrearAdministradorControlador.instance) {
          return CrearAdministradorControlador.instance;
        }
        CrearAdministradorControlador.instance = this;
    }

    
    async crearAdministrador(req, res) {
    const { t1: documento, t2: nombres, t3: telefono, t4: correopersonal, t5: contrasena } = req.body;

    if (!documento?.trim() || !nombres?.trim() || !telefono?.trim() || !correo?.trim() || !contrasena) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }       
    
    if (!/^\d{8,10}$/.test(documento.trim())) {
      return res.status(400).json({ mensaje: 'El documento debe contener entre 8 y 10 números' });
    }

    const validacionNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (!validacionNombre.test(nombres.trim())) {
      return res.status(400).json({ mensaje: 'Los nombres solo deben contener letras y espacios' });
    }

    if (!/^\d{7,15}$/.test(telefono.trim())) {
      return res.status(400).json({ mensaje: 'El teléfono debe contener entre 7 y 15 números' });
    }

    const validacionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!validacionCorreo.test(correo.trim())) {
      return res.status(400).json({ mensaje: 'El correo es inválido' });
    }

    const validacionContrasena = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;
    if (!validacionContrasena.test(contrasena)) {
      return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 8 caracteres, incluyendo una letra, un número y un carácter especial' });
    }

    const validacionAdministrador = await CrearAdministradorModelo.validacionAdministrador(documento, telefono, correopersonal);
      if (validacionAdministrador) {
          return res.status(409).json({mensaje: 'El administrador con ese documento, correo o telefono ya existe'})
      }

    try {
      const saltRounds = 10;
      const hash = await bcrypt.hash(contrasena, saltRounds);
      
      const administrador = { 
        documento, 
        nombres, 
        telefono, 
        correopersonal, 
        contrasena: hash 
                  };
      const AdministradorCreado = await CrearAdministradorModelo.crearAdministrador(administrador);
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