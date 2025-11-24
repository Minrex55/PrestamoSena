import ConsultarEquiposInvitadoModelo from "../../modelo/Invitado/ConsultarEquiposInvitadoModelo.js"

class ConsultarEquiposInvitadoControlador {
    constructor() {
        if (ConsultarEquiposInvitadoControlador.instance) {
            return ConsultarEquiposInvitadoControlador.instance
        }

        ConsultarEquiposInvitadoControlador.instance = this;
    }

    async obtenerEquiposPorInvitado(req, res) {
        const { idinvitado } = req.params;
        try {
            const equipos = await ConsultarEquiposInvitadoModelo.obtenerEquiposPorInvitado(idinvitado);
            res.json(equipos);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener los equipos del invitado' });
        }
    }
}

export default new ConsultarEquiposInvitadoControlador();