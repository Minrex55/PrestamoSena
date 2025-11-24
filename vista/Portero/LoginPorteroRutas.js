import express from 'express';
import LoginPorteroControlador from '../../controlador/Portero/LoginPorteroControlador.js';

class LoginPorteroRutas {
    constructor() {
        if (LoginPorteroRutas.instance) {
            return LoginPorteroRutas.instance;
        }
        this.router = express.Router();
        this.configurarRutas();
        LoginPorteroRutas.instance = this;
    }

    configurarRutas() {
        this.router.post('/login', LoginPorteroControlador.login);
    }

    obtenerRutas() {
        return this.router;
    }
}

const Rutas = new LoginPorteroRutas();
export default Rutas.obtenerRutas();