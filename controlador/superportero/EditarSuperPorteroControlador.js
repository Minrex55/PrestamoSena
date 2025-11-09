import EditarSuperPorteroModelo from '../../modelo/superportero/EditarSuperPorteroModelo.js'; 

class EditarSuperPorteroControlador {
  // Método para editar un portero existente
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
      const superPorteroActualizado = await EditarSuperPorteroModelo.editarSuperPortero(
        id,
        documento,
        nombres,
        telefono,
        correopersonal,
        contrasena
      );

      return res.status(200).json({
        mensaje: 'SuperPortero actualizado exitosamente',
        portero: superPorteroActualizado
      });

    } catch (error) {
      console.error('Error en editarSuperPortero:', error);
      return res.status(500).json({
        error: 'Error interno al editar el SuperPortero.'
      });
    }
  }
}

// Exportamos una instancia única del controlador (opcional, pero común en POO + Express)
export default new EditarSuperPorteroControlador();