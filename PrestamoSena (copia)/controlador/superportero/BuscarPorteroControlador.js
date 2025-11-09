import BuscarPorteroModelo from '../../modelo/superportero/BuscarPorteroModelo.js';

class BuscarPorteroControlador {
    // Método para buscar un portero por id 
    async buscarPorteroPorId(req, res) {
        const { id } = req.params; // Obtener el id desde los parámetros de la solicitud
        const buscarPorteroModelo = new BuscarPorteroModelo();
        try {
            const portero = await buscarPorteroModelo.buscarporId(id);
            if (portero.length === 0) {
                return res.status(404).json({ mensaje: 'Portero no encontrado' });
            }
            res.json(portero);
        } catch (error) {
            console.error('Error al buscar el portero:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor' });
        }
    }

    // Método para mostrar todos los porteros
    async mostrarTodosLosPorteros(req, res) {
        const buscarPorteroModelo = new BuscarPorteroModelo();
        try {
            const porteros = await buscarPorteroModelo.mostrarTodos();
            res.json(porteros);
        } catch (error) {
            console.error('Error al obtener los porteros:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor' });
        }   
    }
}

// Exportamos una instancia única del controlador (opcional, pero común en POO + Express)
export default new BuscarPorteroControlador();