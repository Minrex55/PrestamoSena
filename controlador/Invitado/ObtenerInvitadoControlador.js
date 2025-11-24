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
            const usuario = await ObtenerInvitadoModelo.obtenerInvitadoPorId(idinvitado);
            if (!usuario) {
                return res.status(404).json({ mensaje: 'Usuario no encontrado' });
            }
            res.status(200).json(usuario);
        } catch (error) {
            console.error('Error al obtener el usuario', error);
            res.status(500).json({ mensaje: 'Error al obtener el usuario' });
        }
    }
}

export default new ObtenerInvitadoControlador();