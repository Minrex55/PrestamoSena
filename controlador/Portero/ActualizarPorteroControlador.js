import ActualizarPorteroModelo from '../../modelo/Portero/ActualizarPorteroModelo.js';

class ActualizarPorteroControlador {
    constructor() {
        if (ActualizarPorteroControlador.instance) {
            return ActualizarPorteroControlador.instance
        }
        ActualizarPorteroControlador.instance = this;
    }

    async actualizarPortero(req, res) {
        const {idportero} = req.params;
        const { documento, nombres, telefono, correopersonal, contrasena} = req.body;
        if (!documento || !nombres || !telefono || !correopersonal || !contrasena) {
      return res.status(400).json({
        error: 'Los campos documento, nombres, telefono, correo y contraseña son obligatorios.'
      });
    }

        try {
            const datosActualizar = { documento, nombres, telefono, correopersonal, contrasena };
            const porteroActualizado = await ActualizarPorteroModelo.actualizarPortero(idportero, datosActualizar)

            if (!porteroActualizado) {
                return res.status(404).json({mensaje: 'Portero no encontrado.'})
            }

            return res.status(200).json({
                mensaje: 'Portero Actualizado correctamente',
                porteroActualizado
            })

        }catch(error) {
            console.error('Error al actualizar el portero', error);
            return res.status(500).json({mensaje: 'Error interno al actualizar el portero'});
        }
    }
}

export default new ActualizarPorteroControlador();