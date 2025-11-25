import express from 'express';
import LoginAdministrador from '../../controlador/Administrador/LoginAdministradorControlador.js';

class LoginAdministradorRutas {
    constructor() {
        if (LoginAdministradorRutas.instance) {
            return LoginAdministradorRutas.instance;
        }
        this.router = express.Router();
        this.configurarRutas();
        LoginAdministradorRutas.instance = this;
    }

    configurarRutas() {
        this.router.post('/login', LoginAdministrador.login);
    }

    obtenerRutas() {
        return this.router;
    }
}

const Rutas = new LoginAdministradorRutas();
export default Rutas.obtenerRutas();