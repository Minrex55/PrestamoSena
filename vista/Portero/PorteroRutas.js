import express from 'express';
import ActualizarPorteroControlador from '../../controlador/Portero/ActualizarPorteroControlador.js'
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
    this.router.post('/equipo/crear', CrearEquipoControlador.crearEquipo);
    this.router.get('/equipo/modelo', ObtenerEquipoControlador.obtenerEquipoPorModelo);
    this.router.get('/equipo/serial', ObtenerEquipoControlador.obtenerEquipoPorNumeroDeSerie);
    this.router.get('/equipo', ObtenerEquipoControlador.obtenerEquipos);
    this.router.get('/equipo/:idequipo', ObtenerEquipoControlador.obtenerEquipoPorId);
    this.router.put('/equipo/actualizar/:idequipo', ActualizarEquipoControlador.actualizarEquipo);
    this.router.delete('/equipo/eliminar/:idequipo', EliminarEquipoControlador.eliminarEquipo);
    this.router.get('/invitado/documento', ObtenerInvitadoControlador.obtenerInvitadoPorDocumento);
    this.router.get('/invitado/nombre', ObtenerInvitadoControlador.obtenerInvitadoPorNombre);
    this.router.get('/invitado', ObtenerInvitadoControlador.obtenerInvitados);
    this.router.get('/invitado/:idinvitado', ObtenerInvitadoControlador.obtenerInvitadoPorId);
    this.router.delete('/invitado/eliminar/:idinvitado', EliminarInvitadoControlador.eliminarInvitado);
    this.router.put('/actualizar/:idportero', ActualizarPorteroControlador.actualizarPortero);
}


    obtenerRutas() {
        return this.router;
    }
}

const Rutas = new PorteroRutas();
export default Rutas.obtenerRutas();