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

    if (!documento?.trim() || !nombres?.trim() || !telefono?.trim() || !correopersonal?.trim() || !contrasena) {
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
    if (!validacionCorreo.test(correopersonal.trim())) {
      return res.status(400).json({ mensaje: 'El correo es inválido' });
    }

    const validacionContrasena = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;
    if (!validacionContrasena.test(contrasena)) {
      return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 8 caracteres, incluyendo una letra, un número y un carácter especial' });
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