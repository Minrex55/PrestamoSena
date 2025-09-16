const express = require('express');
const router = express.Router();
const PorteroControlador = require('../controlador/PorteroControlador');

router.get('/', PorteroControlador.listar);
router.get('/:id', PorteroControlador.obtenerPorId);
router.post('/', PorteroControlador.crear);
router.put('/:id', PorteroControlador.actualizar);
router.delete('/:id', PorteroControlador.eliminar);

module.exports = router;

// Rutas disponibles:
// GET     /porteros          -> listar todos los porteros
// GET     /porteros/:id      -> obtener un portero por ID
// POST    /porteros          -> crear un nuevo portero
// PUT     /porteros/:id      -> actualizar un portero
// DELETE  /porteros/:id      -> eliminar un portero