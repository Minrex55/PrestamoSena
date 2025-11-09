import express from 'express';
import cors from 'cors';
import Config from './modelo/bd/Config.js'
// Importar rutas

import porteroRutas from './vista/portero/PorteroRutas.js';
import loginPorteroRutas from './vista/portero/LoginPorteroRutas.js';
import adminporterorutas from './vista/superportero/AdminPorteroRutas.js';
import loginAdminPorteroRutas from './vista/superportero/LoginAdminPorteroRutas.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Permite leer JSON en body
app.use(express.urlencoded({ extended: true }));

// Rutas principales
app.use('/portero', porteroRutas);
app.use('/loginportero', loginPorteroRutas);
app.use('/admin', adminporterorutas);
app.use('/loginadmin', loginAdminPorteroRutas);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('🚀 API funcionando correctamente');
});

// Arranque del servidor
const PORT = Config.PORT;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
