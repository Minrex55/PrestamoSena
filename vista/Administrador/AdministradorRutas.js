import express from 'express';
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
// ---------------------
// RUTAS ADMINISTRADORES
// ---------------------
this.router.post('/crear', CrearAdministradorControlador.crearAdministrador); //ready
this.router.delete('/eliminar/:idadmin', EliminarAdministradorControlador.eliminarAdministrador);//ready
this.router.put('/editar/:idadmin', ActualizarAdministradorControlador.editarAdministrador);//ready
this.router.get('/buscar', ObtenerAdministradorControlador.obtenerAdministradores);//ready
this.router.get('/buscar/:idadmin', ObtenerAdministradorControlador.obtenerAdministradorPorId);//ready
// -------------------------------
// RUTAS RELACIONADAS CON PORTEROS
// -------------------------------
this.router.post('/portero/crear', CrearPorteroControlador.crearPortero);//ready
this.router.delete('/portero/eliminar/:idportero', EliminarPorteroControlador.eliminarPortero);//ready
this.router.put('/portero/editar/:idportero', ActualizarPorteroControlador.editarPortero);//ready
this.router.get('/portero/buscar', ObtenerPorteroControlador.mostrarTodosLosPorteros);//ready
this.router.get('/portero/buscar/:idportero', ObtenerPorteroControlador.obtenerPorteroPorId);//ready
     }

    obtenerRutas() {
        return this.router;
    }
}

const Rutas = new AdministradorRutas();
export default Rutas.obtenerRutas();