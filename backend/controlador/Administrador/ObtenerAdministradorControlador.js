import ObtenerAdministradorModelo from '../../modelo/Administrador/ObtenerAdministradorModelo.js';

class ObtenerAdministradorControlador {
    constructor() {
        if (ObtenerAdministradorControlador.instance) {
            return ObtenerAdministradorControlador.instance
        }
        ObtenerAdministradorControlador.instance = this;
    }

    async obtenerAdministradorPorId(req, res) {
        const { idadmin } = req.params;

        try {
            const administrador = await ObtenerAdministradorModelo.buscarporId(idadmin);
            if (!administrador) {
                return res.status(404).json({ mensaje: 'Administrador no encontrado' });
            }
            res.json(administrador);
        } catch (error) {


            console.error('Error al buscar el administrador:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor' });
        }
    }

    async obtenerAdministradores(req, res) {

        try {
            const obtenerAdministradores = await ObtenerAdministradorModelo.mostrarTodos();
            res.json(obtenerAdministradores);
        } catch (error) {
            console.error('Error al obtener los administradores:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor' });
        }
    }
}

export default new ObtenerAdministradorControlador();