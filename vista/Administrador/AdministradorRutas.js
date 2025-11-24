import express from 'express';
const router = express.Router();

import CrearPorteroControlador from '../../controlador/Administrador/CrearPorteroControlador.js';
import CrearAdministradorControlador from '../../controlador/Administrador/CrearAdministradorControlador.js';
import EliminarPorteroControlador from '../../controlador/Administrador/EliminarPorteroControlador.js';
import EliminarAdministradorControlador from '../../controlador/Administrador/EliminarAdministradorControlador.js';
import BuscarPorteroControlador from '../../controlador/Administrador/BuscarPorteroControlador.js';
import EditarPorteroControlador from '../../controlador/Administrador/EditarPorteroControlador.js';
import EditarAdministradorControlador from '../../controlador/Administrador/EditarAdministradorControlador.js';
import BuscarAdministradorControlador from '../../controlador/Administrador/BuscarAdministradorControlador.js';

// ---------------------
// RUTAS ADMINISTRADORES
// ---------------------
router.post('/crear', CrearAdministradorControlador.crearAdministrador);
router.delete('/eliminar/:id', EliminarAdministradorControlador.eliminarAdministrador);
router.put('/editar/:id', EditarAdministradorControlador.editarAdministrador);
router.get('/buscar', BuscarAdministradorControlador.mostrarTodosLosAdministradores);
router.get('/buscar/:id', BuscarAdministradorControlador.buscarAdministradorPorId);

// -------------------------------
// RUTAS RELACIONADAS CON PORTEROS
// -------------------------------
router.post('/portero/crear', CrearPorteroControlador.crearPortero);
router.delete('/portero/eliminar/:id', EliminarPorteroControlador.eliminarPortero);
router.put('/portero/editar/:id', EditarPorteroControlador.editarPortero);
router.get('/portero/buscar', BuscarPorteroControlador.mostrarTodosLosPorteros);
router.get('/portero/buscar/:id', BuscarPorteroControlador.buscarPorteroPorId);

export default router;
