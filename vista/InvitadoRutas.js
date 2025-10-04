const express = require('express');
const router = express.Router();
const InvitadoControlador = require('../controlador/InvitadoControlador');

// Listar todos
router.get('/', (req, res) => InvitadoControlador.listarTodos(req, res));

// Buscar por ID
router.get('/:id', (req, res) => InvitadoControlador.buscarPorId(req, res));

// Buscar por NOMBRES
router.get('/nombres/:nombres', (req, res) => InvitadoControlador.buscarPorNombres(req, res));

// Buscar por documento
router.get('/documento/:documento', (req, res) => InvitadoControlador.buscarPorDocumento(req, res));

module.exports = router;
