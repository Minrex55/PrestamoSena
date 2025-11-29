import ActualizarAdministradorModelo from '../../modelo/Administrador/ActualizarAdministradorModelo.js'; 
import bcrypt from "bcrypt"

class ActualizarAdministradorControlador {
    constructor() {
        if (ActualizarAdministradorControlador.instance) {
          return ActualizarAdministradorControlador.instance;
        }
        ActualizarAdministradorControlador.instance = this;
    }
    async editarAdministrador(req, res) {
    const { idadmin } = req.params;
    const { t1: documento, t2: nombres, t3: telefono, t4: correopersonal, t5: contrasena } = req.body;

    if (!documento || !nombres || !telefono || !correopersonal || !contrasena) {
      return res.status(400).json({
        error: 'Los campos documento, nombres, telefono, correo y contraseña son obligatorios.'
      });
    }

    try {
      const saltRounds = 10;
      const hash = await bcrypt.hash(contrasena, saltRounds)

      const datosActualizar = { 
        documento, 
        nombres, 
        telefono, 
        correopersonal, 
        contrasena: hash }
        ;
      const AdministradorActualizado = await ActualizarAdministradorModelo.actualizarAdministrador(idadmin, datosActualizar);
      if (!AdministradorActualizado) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }
      return res.status(200).json({
        mensaje: 'Administrador actualizado exitosamente',
        AdministradorActualizado
      });

    } catch (error) {
      console.error('Error en editarAdministrador:', error);
      return res.status(500).json({
        error: error.message || 'Error al actualizar el Administrador.'
      });
    }
  }
}

export default new ActualizarAdministradorControlador();