import ObtenerPorteroModelo from '../../modelo/Administrador/ObtenerPorteroModelo.js';

class ObtenerPorteroControlador {
    constructuor() {
        if (ObtenerPorteroControlador.instance) {
            return ObtenerPorteroControlador.instance;
        }
        ObtenerPorteroControlador.instance = this;
    }

    async obtenerPorteroPorId(req, res) {
        const { idportero } = req.params; // Obtener el id desde los parámetros de la solicitud
        try {
            const porteroObtenidoPorId = await ObtenerPorteroModelo.buscarporId(idportero);

            if (porteroObtenidoPorId === null || porteroObtenidoPorId.length === 0)  {
                return res.status(404).json({ mensaje: 'Portero no encontrado' });
            }

            res.json(porteroObtenidoPorId);

        } catch (error) {
            console.error('Error al obtener el portero:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor' });
        }
    }

    async mostrarTodosLosPorteros(req, res) {
        try {
            const obtenerPorteros = await ObtenerPorteroModelo.mostrarTodos();
            res.json({"Porteros Existentes": obtenerPorteros})

        } catch (error) {
            console.error('Error al obtener los porteros:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor' });
        }
    }
}

export default new ObtenerPorteroControlador();