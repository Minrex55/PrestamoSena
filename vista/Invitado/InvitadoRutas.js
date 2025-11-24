import express from "express"
import CrearInvitadoControlador from "../../controlador/Invitado/CrearInvitadoControlador.js"
import ActualizarInvitadoControlador from "../../controlador/Invitado/ActualizarInvitadoControlador.js"
import ConsultarEquiposInvitadoControlador from "../../controlador/Invitado/ConsultarEquiposInvitadoControlador.js";
import ObtenerInvitadoControlador from "../../controlador/Invitado/ObtenerInvitadoControlador.js"

class InvitadoRutas {
    constructor() {
        if (InvitadoRutas.instance) {
            return InvitadoRutas.instance;
        }
        this.router = express.Router();
        this.configurarRutas();
        InvitadoRutas.instance = this;
    }

    configurarRutas() {
        this.router.post('/crear', CrearInvitadoControlador.crearInvitado);
        this.router.get('/equipos/:idinvitado', ConsultarEquiposInvitadoControlador.obtenerEquiposPorInvitado);
        this.router.get('/:idinvitado', ObtenerInvitadoControlador.obtenerInvitadoPorId);
        this.router.put('/:idinvitado', ActualizarInvitadoControlador.actualizarInvitado);
    }

    obtenerRutas() {
        return this.router;
    }
}

const Rutas =  new InvitadoRutas();
export default Rutas.obtenerRutas();