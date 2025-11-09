import express from 'express';
const router = express.Router();
import LoginPorteroControlador from '../../controlador/portero/LoginPorteroControlador.js';

// Ruta para el login del portero

router.post('/login', LoginPorteroControlador.login);

export default router;

// Rutas disponibles:
// GET     /porteros          -> listar todos los porteros
// GET     /porteros/:id      -> obtener un portero por ID
// POST    /porteros          -> crear un nuevo portero
// PUT     /porteros/:id      -> actualizar un portero
// DELETE  /porteros/:id      -> eliminar un portero