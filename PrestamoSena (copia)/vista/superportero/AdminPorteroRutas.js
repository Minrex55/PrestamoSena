import express from 'express';
const router = express.Router();

import CrearPorteroControlador from '../../controlador/superportero/CrearPorteroControlador.js';
import CrearSuperPorteroControlador from '../../controlador/superportero/CrearSuperPorteroControlador.js';
import EliminarPorteroControlador from '../../controlador/superportero/EliminarPorteroControlador.js';
import EliminarSuperPorteroControlador from '../../controlador/superportero/EliminarSuperPorteroControlador.js';
import BuscarPorteroControlador from '../../controlador/superportero/BuscarPorteroControlador.js';
import EditarPorteroControlador from '../../controlador/superportero/EditarPorteroControlador.js';
import EditarSuperPorteroControlador from '../../controlador/superportero/EditarSuperPorteroControlador.js';

router.post('/portero/crear', CrearPorteroControlador.crearPortero);
router.post('/super/crear', CrearSuperPorteroControlador.crearSuperPortero);
router.delete('/portero/eliminar/:id', EliminarPorteroControlador.eliminarPortero);
router.delete('/super/eliminar/:id', EliminarSuperPorteroControlador.eliminarSuperPortero);
router.get('/portero/buscar', BuscarPorteroControlador.mostrarTodosLosPorteros);
router.get('/portero/buscar/:id', BuscarPorteroControlador.buscarPorteroPorId);
router.put('/portero/editar/:id', EditarPorteroControlador.editarPortero);
router.put('/super/editar/:id', EditarSuperPorteroControlador.editarSuperPortero);

export default router;