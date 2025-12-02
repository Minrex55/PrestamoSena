import ActualizarEquipoModelo from '../../modelo/Portero/ActualizarEquipoModelo.js';

class ActualizarEquipoControlador {
    constructor(){
        if (ActualizarEquipoControlador.instance) {
            return ActualizarEquipoControlador.instance
        }
        ActualizarEquipoControlador.instance = this;
    }

    async actualizarEquipo(req, res) {
        const { idequipo } = req.params;
        
        // Se agrega t4 para el Estado (Activo/Inactivo)
        const { t1: modelo, t2: numerodeserie, t3: idinvitado, t4: estado } = req.body;

        // 1. Validar que existan los datos básicos
        if (!modelo?.trim() || !numerodeserie?.trim() || !idinvitado?.trim() || !estado?.trim()) {
            return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
        }       

        // 2. Validaciones de formato (Regex)
        const validacionModelo = /^[A-Za-z0-9\-_ ]{10,30}$/;
        if (!validacionModelo.test(modelo.trim())) {
            return res.status(400).json({ mensaje: 'El modelo debe tener entre 10 y 30 caracteres' });
        }

        const validacionNumeroSerie = /^[A-Za-z0-9-]{6,30}$/;
        if (!validacionNumeroSerie.test(numerodeserie.trim())) {
            return res.status(400).json({ mensaje: 'El número de serie debe tener entre 6 y 30 caracteres' });
        }

        // 3. Validar duplicidad de serial (Excluyendo el propio equipo)
        // Pasamos 'idequipo' para que no marque error si no cambiamos el serial
        const serialDuplicado = await ActualizarEquipoModelo.validacionEquipo(numerodeserie, idequipo);
        if (serialDuplicado) {
            return res.status(409).json({ mensaje: 'El equipo con ese número de serie ya existe en otro registro' });
        }

        try {
            // Empaquetamos los datos, incluyendo el estado
            const equipo = { modelo, numerodeserie, idinvitado, estado };
            
            const equipoActualizado = await ActualizarEquipoModelo.actualizarEquipo(idequipo, equipo);
            
            if (!equipoActualizado) {
                return res.status(404).json({ mensaje: 'Equipo no encontrado.' });
            }

            return res.status(200).json({
                mensaje: 'Equipo actualizado correctamente',
                equipoActualizado
            });

        } catch(error) {
            console.error('Error al actualizar el equipo:', error);
            return res.status(500).json({ mensaje: 'Error interno al actualizar el equipo' });
        }
    }
}

export default new ActualizarEquipoControlador();