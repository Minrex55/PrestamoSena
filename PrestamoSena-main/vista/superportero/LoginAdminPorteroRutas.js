import express from 'express';
const router = express.Router();

import LoginSuperPortero from '../../controlador/superportero/LoginSuperPorteroControlador.js';

router.post('/login', LoginSuperPortero.login);

export default router;