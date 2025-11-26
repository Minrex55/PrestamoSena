import ObtenerInvitadoModelo from "../../modelo/Invitado/ObtenerInvitadoModelo.js";

class ObtenerInvitadoControlador {
    constructor() {
        if (ObtenerInvitadoControlador.instance) {
            return ObtenerInvitadoControlador.instance;
        }

        ObtenerInvitadoControlador.instance = this
    }

    async obtenerInvitadoPorId(req, res) {
        const { idinvitado } = req.params;

        if (!idinvitado) {
            return res.status(400).json({ mensaje: 'El ID es obligatorio' });
        }

        try {
            const invitado = await ObtenerInvitadoModelo.obtenerInvitadoPorId(idinvitado);
            if (!invitado) {
                return res.status(404).json({ mensaje: 'Usuario no encontrado' });
            }
            res.status(200).json({
                mensaje: "Invitado obtenido correctamente",
                invitado
            });
        } catch (error) {
            console.error('Error al obtener el invitado', error);
            res.status(500).json({ mensaje: 'Error al obtener el invitado' });
        }
    }
}

export default new ObtenerInvitadoControlador();