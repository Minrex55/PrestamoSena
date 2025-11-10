import EditarSuperPorteroModelo from '../../modelo/superportero/EditarSuperPorteroModelo.js'; 

class EditarSuperPorteroControlador {
  // Método para editar un SuperPortero existente
  async editarSuperPortero(req, res) {
    const { id } = req.params;
    const { documento, nombres, telefono, correopersonal, contrasena } = req.body;

    // Validación básica
    if (!documento || !nombres || !correopersonal || !contrasena) {
      return res.status(400).json({
        error: 'Los campos documento, nombres, correo y contraseña son obligatorios.'
      });
    }

    try {
      const datosActualizar = { documento, nombres, telefono, correopersonal, contrasena };
      const superPorteroActualizado = await EditarSuperPorteroModelo.editarSuperPortero(id, datosActualizar);


      return res.status(200).json({
        mensaje: 'SuperPortero actualizado exitosamente',
        superPortero: superPorteroActualizado
      });

    } catch (error) {
      console.error('Error en editarSuperPortero:', error);
      return res.status(500).json({
        error: error.message || 'Error al actualizar el Superportero.'
      });
    }
  }
}

// Exportamos una instancia única del controlador (opcional, pero común en POO + Express)
export default new EditarSuperPorteroControlador();