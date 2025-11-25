import EditarPorteroModelo from '../../modelo/Administrador/EditarPorteroModelo.js'; 

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

    // Validación básica
    if (!documento || !nombres || !telefono || !correopersonal || !contrasena) {
      return res.status(400).json({
        error: 'Los campos documento, nombres, telefono, correo y contraseña son obligatorios.'
      });
    }

    try {
      const datosActualizar = { documento, nombres, telefono, correopersonal, contrasena };
      const porteroActualizado = await EditarPorteroModelo.editarPortero(idportero, datosActualizar);


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