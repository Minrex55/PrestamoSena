import express from 'express';
const router = express.Router();

import ActualizarInformacionPorteroControlador from '../../controlador/portero/ActualizarInformacionPorteroControlador.js'
import BuscarEquipoControlador from '../../controlador/portero/BuscarEquipoControlador.js'
import BuscarInvitadoControlador from '../../controlador/portero/BuscarInvitadoControlador.js'
import CrearEquipoControlador from '../../controlador/portero/CrearEquipoControlador.js'
import EditarEquipoControlador from '../../controlador/portero/EditarEquipoControlador.js'
import EliminarEquipoControlador from '../../controlador/portero/EliminarEquipoControlador.js'

router.put('/:id', ActualizarInformacionPorteroControlador.actualizarInformacion);
router.get('/equipo/modelo/:modelo', BuscarEquipoControlador.buscarEquipoPorModelo);
router.get('/equipo/serial/:serial', BuscarEquipoControlador.buscarEquipoPorSerial);
router.get('/equipo', BuscarEquipoControlador.listarTodosLosEquipos);
router.get('/equipo/:id', BuscarEquipoControlador.buscarEquipoPorId);
router.get('/invitado/:id', BuscarInvitadoControlador.buscarPorId);
router.get('/invitado/nombre/:nombre', BuscarInvitadoControlador.buscarPorNombre);
router.get('/invitado/documento/:documento', BuscarInvitadoControlador.buscarPorDocumento);
router.get('/invitado', BuscarInvitadoControlador.listarTodos);
router.post('/equipo/crear', CrearEquipoControlador.crearEquipo);
router.put('/equipo/editar/:id', EditarEquipoControlador.editarEquipo);
router.delete('/equipo/eliminar/:id', EliminarEquipoControlador.eliminarEquipo);

export default router;