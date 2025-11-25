import EditarAdministradorModelo from '../../modelo/Administrador/EditarAdministradorModelo.js'; 

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

    // Validación básica
    if (!documento || !nombres || !telefono || !correopersonal || !contrasena) {
      return res.status(400).json({
        error: 'Los campos documento, nombres, telefono, correo y contraseña son obligatorios.'
      });
    }

    try {
      const datosActualizar = { documento, nombres, telefono, correopersonal, contrasena };
      const AdministradorActualizado = await EditarAdministradorModelo.editarAdministrador(idadmin, datosActualizar);


      return res.status(200).json({
        mensaje: 'Administrador actualizado exitosamente',
        Administrador: AdministradorActualizado
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