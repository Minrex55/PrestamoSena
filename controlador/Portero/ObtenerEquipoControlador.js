import ObtenerEquipoModelo from '../../modelo/Portero/ObtenerEquipoModelo.js';

class ObtenerEquipoControlador {
    constructor() {
        if (ObtenerEquipoControlador.instance) {
            return ObtenerEquipoControlador.instance
        }
        ObtenerEquipoControlador.instance = this;
    }

    async obtenerEquipoPorId (req, res) {
        const {idequipo} = req.params;
        
        try {
            const equipoObtenidoPorId = await ObtenerEquipoModelo.obtenerEquipoPorId(idequipo);
            if (!equipoObtenidoPorId) {
                return res.status(404).json({ mensaje: 'Equipo no encontrado' });
            }

            return res.status(200).json({
                mensaje: 'Equipo obtenido correctamente',
                equipoObtenidoPorId
            })

        }catch(error) {
            console.error('Error al buscar el equipo', error);
            res.status(500).json({ mensaje: 'Error interno al obtener el equipo' });
        }
    }

    async obtenerEquipoPorModelo(req, res) {
        const {modelo} = req.body

        try {
            const equipoObtenidoPorModelo = await ObtenerEquipoModelo.obtenerEquipoPorModelo(modelo);

            if (!equipoObtenidoPorModelo) {
                return res.status(404).json({ mensaje: 'Equipo no encontrado' });
            }

            return res.status(200).json({
                mensaje: 'Equipo obtenido correctamente',
                equipoObtenidoPorModelo
            })

        }catch(error) {
            console.error('Error al buscar el equipo', error);
            res.status(500).json({ mensaje: 'Error interno al obtener el equipo' });
        }
    }

    async obtenerEquipoPorNumeroDeSerie(req, res) {
        const {numerodeserie} = req.body

        try {
            const equipoObtenidoPorNumeroDeSerie = await ObtenerEquipoModelo.obtenerEquipoPorNumeroDeSerie(numerodeserie);

            if (!equipoObtenidoPorNumeroDeSerie) {
                return res.status(404).json({ mensaje: 'Equipo no encontrado' });
            }

            return res.status(200).json({
                mensaje: 'Equipo obtenido correctamente',
                equipoObtenidoPorNumeroDeSerie
            })

        }catch(error) {
            console.error('Error al buscar el equipo', error);
            res.status(500).json({ mensaje: 'Error interno al obtener el equipo' });
        }
    }

    async obtenerEquipos(req, res) {

        try {
            const equiposObtenidos = await ObtenerEquipoModelo.obtenerEquipos();

            return res.status(200).json({
                mensaje: 'Equipos obtenidos correctamente',
                equiposObtenidos
            })

        }catch(error) {
            console.error('Error al obtener los equipos', error);
            res.status(500).json({ mensaje: 'Error interno al obtener los equipos' });
        }
    }
}

export default new ObtenerEquipoControlador();