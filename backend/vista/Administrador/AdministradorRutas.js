import express from 'express';
import AuthMiddleware from "../../middlewares/AuthMiddleware.js";
import RoleMiddleware from "../../middlewares/RoleMiddleware.js";
const router = express.Router();

import CrearPorteroControlador from '../../controlador/Administrador/CrearPorteroControlador.js';
import CrearAdministradorControlador from '../../controlador/Administrador/CrearAdministradorControlador.js';
import EliminarPorteroControlador from '../../controlador/Administrador/EliminarPorteroControlador.js';
import EliminarAdministradorControlador from '../../controlador/Administrador/EliminarAdministradorControlador.js';
import ObtenerPorteroControlador from '../../controlador/Administrador/ObtenerPorteroControlador.js';
import ActualizarPorteroControlador from '../../controlador/Administrador/ActualizarPorteroControlador.js';
import ActualizarAdministradorControlador from '../../controlador/Administrador/ActualizarAdministradorControlador.js';
import ObtenerAdministradorControlador from '../../controlador/Administrador/ObtenerAdministradorControlador.js';


class AdministradorRutas {
    constructor() {
        if (AdministradorRutas.instance) {
            return AdministradorRutas.instance;
        }
        this.router = express.Router();
        this.configurarRutas();
        AdministradorRutas.instance = this;
    }
        configurarRutas() {
            // Proteger todas las rutas
            this.router.use((req, res, next) => AuthMiddleware.autenticar(req, res, next));
            this.router.use(RoleMiddleware.verificarRol('Administrador'));


            this.router.post('/crear', CrearAdministradorControlador.crearAdministrador);
            this.router.delete('/eliminar/:idadmin', EliminarAdministradorControlador.eliminarAdministrador);
            this.router.put('/actualizar/:idadmin', ActualizarAdministradorControlador.editarAdministrador);
            this.router.get('/buscar', ObtenerAdministradorControlador.obtenerAdministradores);
            this.router.get('/buscar/:idadmin', ObtenerAdministradorControlador.obtenerAdministradorPorId);
            this.router.post('/portero/crear', CrearPorteroControlador.crearPortero);
            this.router.delete('/portero/eliminar/:idportero', EliminarPorteroControlador.eliminarPortero);
            this.router.put('/portero/actualizar/:idportero', ActualizarPorteroControlador.editarPortero);
            this.router.get('/portero/buscar', ObtenerPorteroControlador.mostrarTodosLosPorteros);
            this.router.get('/portero/buscar/:idportero', ObtenerPorteroControlador.obtenerPorteroPorId);
        }

    obtenerRutas() {
        return this.router;
    }
}

const Rutas = new AdministradorRutas();
export default Rutas.obtenerRutas();