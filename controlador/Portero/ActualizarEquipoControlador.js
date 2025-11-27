import ActualizarEquipoModelo from '../../modelo/Portero/ActualizarEquipoModelo.js';

class ActualizarEquipoControlador {
    constructor(){
        if (ActualizarEquipoControlador.instance) {
            return ActualizarEquipoControlador.instance
        }
        ActualizarEquipoControlador.instance = this;
    }

    async actualizarEquipo(req, res) {
        const {idequipo} = req.params;
        const {t1: modelo, t2: numerodeserie, t3: idinvitado} = req.body;

        if (!modelo || !numerodeserie || !idinvitado) {
              return res.status(400).json({
                error: 'Los campos modelo, numero de serie e id invitado son obligatorios.'
              });
            }

        try {
            const equipo = {modelo, numerodeserie, idinvitado}
            const equipoActualizado = await ActualizarEquipoModelo.actualizarEquipo(idequipo, equipo)
            
            if (!equipoActualizado) {
                return res.status(404).json({mensaje: 'Equipo no encontrado.'})
            }

            return res.status(200).json({
                mensaje: 'Equipo Actualizado correctamente',
                equipoActualizado
            })

        }catch(error) {
            console.error('Error al actualizar el equipo')
            return res.status(500).json({mensaje: 'Error interno al actualizar el equipo'})
        }
    }
}

export default new ActualizarEquipoControlador();