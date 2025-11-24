import BuscarAdministradorModelo from '../../modelo/Administrador/BuscarAdministradorModelo.js';

class BuscarAdministradorControlador {
    // Método para buscar un administrador por id 
    async buscarAdministradorPorId(req, res) {
        const { id } = req.params; // Obtener el id desde los parámetros de la solicitud
        const buscarAdministradorModelo = new BuscarAdministradorModelo();
        try {
            const administrador = await buscarAdministradorModelo.buscarporId(id);
            if (administrador.length === 0) {
                return res.status(404).json({ mensaje: 'Administrador no encontrado' });
            }
            res.json(administrador);
        } catch (error) {
            console.error('Error al buscar el administrador:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor' });
        }
    }

    // Método para mostrar todos los administradores
    async mostrarTodosLosAdministradores(req, res) {
        const buscarAdministradorModelo = new BuscarAdministradorModelo();
        try {
            const administradores = await buscarAdministradorModelo.mostrarTodos();
            res.json(administradores);
        } catch (error) {
            console.error('Error al obtener los administradores:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor' });
        }   
    }
}

// Exportamos una instancia única del controlador (opcional, pero común en POO + Express)
export default new BuscarAdministradorControlador();