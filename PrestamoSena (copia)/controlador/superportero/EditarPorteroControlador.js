import EditarPorteroModelo from '../../modelo/superportero/EditarPorteroModelo.js'; 

class EditarPorteroControlador {
  // Método para editar un portero existente
  async editarPortero(req, res) {
    const { id } = req.params;
    const { documento, nombres, telefono, correopersonal, contrasena } = req.body;

    // Validación básica
    if (!documento || !nombres || !correopersonal || !contrasena) {
      return res.status(400).json({
        error: 'Los campos documento, nombres, correo y contraseña son obligatorios.'
      });
    }

    try {
      const porteroActualizado = await EditarPorteroModelo.editarPortero(
        id,
        documento,
        nombres,
        telefono,
        correopersonal,
        contrasena
      );

      return res.status(200).json({
        mensaje: 'Portero actualizado exitosamente',
        portero: porteroActualizado
      });

    } catch (error) {
      console.error('Error en editarPortero:', error);
      return res.status(500).json({
        error: 'Error interno al editar el portero.'
      });
    }
  }
}

// Exportamos una instancia única del controlador (opcional, pero común en POO + Express)
export default new EditarPorteroControlador();