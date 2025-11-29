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

        if (!modelo?.trim() || !numerodeserie?.trim() || !idinvitado?.trim()) {
            return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
        }       

        const validacionModelo = /^[A-Za-z0-9\-_ ]{10,30}$/;
        if (!validacionModelo.test(modelo.trim())) {
            return res.status(400).json({ mensaje: 'El modelo debe tener entre 10 y 30 caracteres' });
        }

        const validacionNumeroSerie = /^[A-Za-z0-9-]{6,30}$/;
        if (!validacionNumeroSerie.test(numerodeserie.trim())) {
            return res.status(400).json({ mensaje: 'El número de serie debe tener entre 6 y 30 caracteres' });
        }

        const validacionEquipo = await ActualizarEquipoModelo.validacionEquipo(numerodeserie);
        if (validacionEquipo) {
            return res.status(409).json({mensaje: 'El equipo con ese numero de serie ya existe'})
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