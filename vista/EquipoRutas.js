const express = require('express');
const router = express.Router();
const EquipoControlador = require('../controlador/EquipoControlador');

// Listar todos
router.get('/', (req, res) => EquipoControlador.listarTodos(req, res));

// Buscar por ID
router.get('/:id', (req, res) => EquipoControlador.buscarPorId(req, res));

// Buscar por Modelo
router.get('/modelo/:modelo', (req, res) => EquipoControlador.buscarPorModelo(req, res));

// Buscar por serial
router.get('/serial/:serial', (req, res) => EquipoControlador.buscarPorSerial(req, res));

module.exports = router;
