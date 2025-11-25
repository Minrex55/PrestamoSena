import express from 'express';
const router = express.Router();

import CrearPorteroControlador from '../../controlador/Administrador/CrearPorteroControlador.js';
import CrearAdministradorControlador from '../../controlador/Administrador/CrearAdministradorControlador.js';
import EliminarPorteroControlador from '../../controlador/Administrador/EliminarPorteroControlador.js';
import EliminarAdministradorControlador from '../../controlador/Administrador/EliminarAdministradorControlador.js';
import BuscarPorteroControlador from '../../controlador/Administrador/BuscarPorteroControlador.js';
import EditarPorteroControlador from '../../controlador/Administrador/EditarPorteroControlador.js';
import EditarAdministradorControlador from '../../controlador/Administrador/EditarAdministradorControlador.js';
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
// ---------------------
// RUTAS ADMINISTRADORES
// ---------------------
this.router.post('/crear', CrearAdministradorControlador.crearAdministrador);
this.router.delete('/eliminar/:id', EliminarAdministradorControlador.eliminarAdministrador);
this.router.put('/editar/:id', EditarAdministradorControlador.editarAdministrador);
this.router.get('/buscar', ObtenerAdministradorControlador.obtenerAdministradores);
this.router.get('/buscar/:idadmin', ObtenerAdministradorControlador.obtenerAdministradorPorId);
// -------------------------------
// RUTAS RELACIONADAS CON PORTEROS
// -------------------------------
this.router.post('/portero/crear', CrearPorteroControlador.crearPortero);
this.router.delete('/portero/eliminar/:id', EliminarPorteroControlador.eliminarPortero);
this.router.put('/portero/editar/:id', EditarPorteroControlador.editarPortero);
this.router.get('/portero/buscar', BuscarPorteroControlador.mostrarTodosLosPorteros);
this.router.get('/portero/buscar/:id', BuscarPorteroControlador.buscarPorteroPorId);
     }

    obtenerRutas() {
        return this.router;
    }
}

const Rutas = new AdministradorRutas();
export default Rutas.obtenerRutas();