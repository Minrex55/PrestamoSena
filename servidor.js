const express = require('express');
const cors = require('cors');
const Config = require('./modelo/bd/Config');

// Importar rutas
const invitadosRoutes = require('./vista/InvitadoRutas');
const equiposRoutes = require('./vista/EquipoRutas');
const adminporterorutas = require('./vista/superportero/AdminPorteroRutas');
const loginporterorutas = require('./vista/portero/LoginPorteroRutas');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Permite leer JSON en body
app.use(express.urlencoded({ extended: true }));

// Rutas principales
app.use('/invitados', invitadosRoutes);
app.use('/equipos', equiposRoutes);
app.use('/superportero', adminporterorutas);
app.use('/ingreso', loginporterorutas);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('🚀 API funcionando correctamente');
});

// Arranque del servidor
const PORT = Config.PORT;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
