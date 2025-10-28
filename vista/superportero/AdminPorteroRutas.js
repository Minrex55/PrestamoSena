const express = require('express');
const router = express.Router();
const PorteroControlador = require('../../controlador/superportero/CrearPorteroControlador');
const SuperPorteroControlador = require('../../controlador/superportero/CrearSuperPorteroControlador');
const LoginSuperPortero = require('../../controlador/superportero/LoginSuperPorteroControlador');

router.post('/admin/portero/crear', PorteroControlador.crearPortero);
router.post('/admin/super/crear', SuperPorteroControlador.crearSuperPortero);
router.post('/admin/super/login', LoginSuperPortero.login);

module.exports = router;

// Rutas disponibles:
// GET     /porteros          -> listar todos los porteros
// GET     /porteros/:id      -> obtener un portero por ID
// POST    /porteros          -> crear un nuevo portero
// PUT     /porteros/:id      -> actualizar un portero
// DELETE  /porteros/:id      -> eliminar un portero