import express from "express";
import LoginInvitadoControlador from "../../controlador/Invitado/LoginInvitadoControlador.js";

class LoginInvitadoRutas {
    constructor() {
        if (LoginInvitadoRutas.instance)  {
        return LoginInvitadoRutas.instance;
        }
        this.router = express.Router();
        this.configurarRutas();
        LoginInvitadoRutas.instance = this;
    }

    configurarRutas() {
        this.router.post('/login', LoginInvitadoControlador.login);
    }

    obtenerRutas() {
        return this.router
    }
}

const Rutas = new LoginInvitadoRutas();
export default Rutas.obtenerRutas();