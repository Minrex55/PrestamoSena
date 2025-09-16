const express = require('express');
const router = express.Router();
const InvitadoControlador  = require('../controlador/InvitadoControlador');

router.get('/:id', InvitadoControlador.buscarId);

module.exports = router;