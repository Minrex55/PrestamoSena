import ActualizarPorteroModelo from '../../modelo/Administrador/ActualizarPorteroModelo.js'; 
import bcrypt from 'bcrypt';

class ActualizarPorteroControlador {
    constructor() {
        if (ActualizarPorteroControlador.instance) {
            return ActualizarPorteroControlador.instance;
        }
        ActualizarPorteroControlador.instance = this;
    }
    async editarPortero(req, res) {
    const { idportero } = req.params;
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

    const validacionPortero = await ActualizarPorteroModelo.validacionPorteroActualizar(documento, telefono, correopersonal, idportero);
    if (validacionPortero) {
      return res.status(409).json({mensaje: 'El portero con ese documento, correo o telefono ya existe'})
    }
    
    try {
      const saltRounds = 10;
      const hash = await bcrypt.hash(contrasena, saltRounds)
    
      const datosActualizar = { 
        documento, 
        nombres, 
        telefono, 
        correopersonal, 
        contrasena: hash 
      };

      const porteroActualizado = await ActualizarPorteroModelo.actualizarPortero(idportero, datosActualizar);

      return res.status(200).json({
        mensaje: 'Portero actualizado exitosamente',
        portero: porteroActualizado
      });

    } catch (error) {
      console.error('Error en editarPortero:', error);
      return res.status(500).json({
        error: error.message || 'Error al actualizar el portero.'
      });
    }
  }
}

export default new ActualizarPorteroControlador();