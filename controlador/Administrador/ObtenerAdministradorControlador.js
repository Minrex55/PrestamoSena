import ObtenerAdministradorModelo from '../../modelo/Administrador/ObtenerAdministradorModelo.js';

class ObtenerAdministradorControlador {
    constructor() {
        if (ObtenerAdministradorControlador.instance) {
            return ObtenerAdministradorControlador.instance
        }
        ObtenerAdministradorControlador.instance = this;
    }
    // Método para buscar un administrador por id 
    async obtenerAdministradorPorId(req, res) {
        const { idadmin } = req.params; // Obtener el id desde los parámetros de la solicitud

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

    // Método para mostrar todos los administradores
    async obtenerAdministradores(req, res) {

        try {
            const administradores = await ObtenerAdministradorModelo.mostrarTodos();
            res.json(administradores);
        } catch (error) {
            console.error('Error al obtener los administradores:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor' });
        }
    }
}

// Exportamos una instancia única del controlador (opcional, pero común en POO + Express)
export default new ObtenerAdministradorControlador();