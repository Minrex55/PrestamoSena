const Portero = require('../modelo/PorteroModelo');

const PorteroControlador = {
    // GET /porteros
    async listar(req, res) {
        try {
            const porteroModelo = new Portero(); // No necesita datos para listar
            const porteros = await porteroModelo.mostrarTodos();
            res.status(200).json(porteros);
        } catch (error) {
            console.error('Error al listar porteros:', error);
            res.status(500).json({ mensaje: 'Error al obtener los porteros' });
        }
    },

    // GET /porteros/:id
    async obtenerPorId(req, res) {
        const { id } = req.params;
        try {
            const porteroModelo = new Portero();
            const portero = await porteroModelo.buscarporId(id);

            if (!portero || portero.length === 0) {
                return res.status(404).json({ mensaje: 'Portero no encontrado' });
            }

            res.status(200).json(portero[0]); // Devuelvo solo un objeto
        } catch (error) {
            console.error('Error al obtener portero por ID:', error);
            res.status(500).json({ mensaje: 'Error al obtener el portero' });
        }
    },

    // POST /porteros
    async crear(req, res) {
        const { t1: documento, t2: nombres, t3: telefono, t4: correopersonal, t5: contrasena, t6:rol } = req.body;

        if (!documento || !nombres || !telefono || !correopersonal || !contrasena || !rol) {
            return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
        }

        try {
            const nuevoPortero = new Portero(documento, nombres, telefono, correopersonal, contrasena, rol);
            const porteroGuardado = await nuevoPortero.guardarPortero();
            res.status(201).json(porteroGuardado);
        } catch (error) {
            console.error('Error al crear portero:', error);
            res.status(500).json({ mensaje: 'Error al crear el portero' });
        }
    },

        // PUT /porteros/:id
    async actualizar(req, res) {
        const { id } = req.params;
        const { t1: documento, t2: nombres, t3: telefono, t4: correopersonal, t5: contrasena, t6: rol } = req.body;

        const datos = {};
        if (documento) datos.documento = documento;
        if (nombres) datos.nombres = nombres;
        if (telefono) datos.telefono = telefono;
        if (correopersonal) datos.correopersonal = correopersonal;
        if (contrasena) datos.contrasena = contrasena;
        if (rol) datos.rol = rol;

        if (Object.keys(datos).length === 0) {
            return res.status(400).json({ mensaje: 'No hay datos para actualizar' });
        }

        try {
            const porteroModelo = new Portero();
            const porteroExistente = await porteroModelo.buscarporId(id);

            if (!porteroExistente || porteroExistente.length === 0) {
                return res.status(404).json({ mensaje: 'Portero no encontrado' });
            }

            const porteroActualizado = await porteroModelo.editarPortero(id, datos);
            res.status(200).json(porteroActualizado);
        } catch (error) {
            console.error('Error al actualizar portero:', error);
            res.status(500).json({ mensaje: 'Error al actualizar el portero' });
        }
    },

    // DELETE /porteros/:id
    async eliminar(req, res) {
        const { id } = req.params;
        try {
            const porteroModelo = new Portero();
            const eliminado = await porteroModelo.eliminarPortero(id);

            if (!eliminado) {
                return res.status(404).json({ mensaje: 'Portero no encontrado' });
            }

            res.status(200).json({ mensaje: 'Portero eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar portero:', error);
            res.status(500).json({ mensaje: 'Error al eliminar el portero' });
        }
    }
}

module.exports = PorteroControlador;