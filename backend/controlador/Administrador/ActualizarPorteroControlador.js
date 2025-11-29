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