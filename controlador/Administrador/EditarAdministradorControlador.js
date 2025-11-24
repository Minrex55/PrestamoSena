import EditarAdministradorModelo from '../../modelo/Administrador/EditarAdministradorModelo.js'; 

class EditarAdministradorControlador {
  // Método para editar un Administrador existente
  async editarAdministrador(req, res) {
    const { id } = req.params;
    const { documento, nombres, telefono, correopersonal, contrasena } = req.body;

    // Validación básica
    if (!documento || !nombres || !telefono || !correopersonal || !contrasena) {
      return res.status(400).json({
        error: 'Los campos documento, nombres, telefono, correo y contraseña son obligatorios.'
      });
    }

    try {
      const datosActualizar = { documento, nombres, telefono, correopersonal, contrasena };
      const AdministradorActualizado = await EditarAdministradorModelo.editarAdministrador(id, datosActualizar);


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

// Exportamos una instancia única del controlador (opcional, pero común en POO + Express)
export default new EditarAdministradorControlador();