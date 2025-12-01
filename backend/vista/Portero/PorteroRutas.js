import express from 'express';
//import AuthMiddleware from "../../middlewares/AuthMiddleware.js";
//import RoleMiddleware from "../../middlewares/RoleMiddleware.js";


import ObtenerEquipoControlador from '../../controlador/Portero/ObtenerEquipoControlador.js'
import ObtenerInvitadoControlador from '../../controlador/Portero/ObtenerInvitadoControlador.js'
import CrearEquipoControlador from '../../controlador/Portero/CrearEquipoControlador.js'
import ActualizarEquipoControlador from '../../controlador/Portero/ActualizarEquipoControlador.js'
import EliminarEquipoControlador from '../../controlador/Portero/EliminarEquipoControlador.js'
import EliminarInvitadoControlador from '../../controlador/Portero/EliminarInvitadoControlador.js'

class PorteroRutas {
    constructor() {
        if (PorteroRutas.instance) {
            return PorteroRutas.instance;
        }
        this.router = express.Router();
        this.configurarRutas();
        PorteroRutas.instance = this;
    }

    configurarRutas() {
    // Proteger todas las rutas
        //this.router.use((req, res, next) => AuthMiddleware.autenticar(req, res, next));
        //this.router.use(RoleMiddleware.verificarRol('Administrador'));

        this.router.post('/equipo/crear', CrearEquipoControlador.crearEquipo);
        this.router.get('/equipo/modelo', ObtenerEquipoControlador.obtenerEquipoPorModelo);
        this.router.get('/equipo/serial', ObtenerEquipoControlador.obtenerEquipoPorNumeroDeSerie);
        this.router.get('/equipo/buscar', ObtenerEquipoControlador.obtenerEquipos);
        this.router.get('/equipo/buscar/:idequipo', ObtenerEquipoControlador.obtenerEquipoPorId);
        this.router.put('/equipo/actualizar/:idequipo', ActualizarEquipoControlador.actualizarEquipo);
        this.router.delete('/equipo/eliminar/:idequipo', EliminarEquipoControlador.eliminarEquipo);
        this.router.get('/invitado/documento', ObtenerInvitadoControlador.obtenerInvitadoPorDocumento);
        this.router.get('/invitado/nombre', ObtenerInvitadoControlador.obtenerInvitadoPorNombre);
        this.router.get('/invitado', ObtenerInvitadoControlador.obtenerInvitados);
        this.router.get('/invitado/:idinvitado', ObtenerInvitadoControlador.obtenerInvitadoPorId);
        this.router.delete('/invitado/eliminar/:idinvitado', EliminarInvitadoControlador.eliminarInvitado);
}


    obtenerRutas() {
        return this.router;
    }
}

const Rutas = new PorteroRutas();
export default Rutas.obtenerRutas();