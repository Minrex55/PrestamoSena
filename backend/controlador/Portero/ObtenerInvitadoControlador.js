import ObtenerInvitadoModelo from '../../modelo/Portero/ObtenerInvitadoModelo.js';

class ObtenerInvitadoControlador {
    constructor() {
        if (ObtenerInvitadoControlador.instance) {
            return ObtenerInvitadoControlador.instance
        }
        ObtenerInvitadoControlador.instance = this;
    }

    async obtenerInvitadoPorId (req, res) {
        const {idinvitado} = req.params;
        
        try {
            const invitadoObtenidoPorId = await ObtenerInvitadoModelo.obtenerInvitadoPorId(idinvitado)
            if (!invitadoObtenidoPorId) {
                return res.status(404).json({ mensaje: 'Invitado no encontrado' });
            }

            return res.status(200).json({
                mensaje: 'Invitado obtenido correctamente',
                invitadoObtenidoPorId
            })

        }catch(error) {
            console.error('Error al buscar el invitado', error);
            res.status(500).json({ mensaje: 'Error interno al obtener el invitado' });
        }
    }

    async obtenerInvitadoPorDocumento(req, res) {
        const {documento} = req.query;

        if (!documento) {
            return res.status(400).json({ mensaje: 'Documento requerido' });
        }

        try {
            // CORRECCIÓN AQUÍ: Limpiar espacios antes de llamar al modelo
            const docLimpio = documento.trim();

            const invitadoObtenidoPorDocumento = await ObtenerInvitadoModelo.obtenerInvitadoPorDocumento(docLimpio);

            if (!invitadoObtenidoPorDocumento) {
                return res.status(404).json({ mensaje: 'Invitado no encontrado' });
            }

            return res.status(200).json({
                mensaje: 'Invitado obtenido correctamente',
                invitadoObtenidoPorDocumento
            })

        }catch(error) {
            console.error('Error al buscar el invitado', error);
            res.status(500).json({ mensaje: 'Error interno al obtener el invitado' });
        }
    }

    async obtenerInvitadoPorNombre(req, res) {
        const {nombres} = req.query

        try {
            const invitadoObtenidoPorNombre = await ObtenerInvitadoModelo.obtenerInvitadoPorNombre(nombres);

            if (!invitadoObtenidoPorNombre) {
                return res.status(404).json({ mensaje: 'Invitado no encontrado' });
            }

            return res.status(200).json({
                mensaje: 'Invitado obtenido correctamente',
                invitadoObtenidoPorNombre
            })

        }catch(error) {
            console.error('Error al buscar el invitado', error);
            res.status(500).json({ mensaje: 'Error interno al obtener el invitado' });
        }
    }

    async obtenerInvitados(req, res) {

        try {
            const invitadosObtenidos = await ObtenerInvitadoModelo.obtenerInvitados()

            return res.status(200).json({
                mensaje: 'Invitados obtenidos correctamente',
                invitadosObtenidos
            })

        }catch(error) {
            console.error('Error al obtener los invitados', error);
            res.status(500).json({ mensaje: 'Error interno al obtener los invitados' });
        }
    }
}

export default new ObtenerInvitadoControlador();