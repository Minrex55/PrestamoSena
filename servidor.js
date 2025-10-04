const express = require('express');
const cors = require('cors');
const Config = require('./modelo/bd/Config');

// Importar rutas
const invitadosRoutes = require('./vista/InvitadoRutas');
const equiposRoutes = require('./vista/EquipoRutas');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Permite leer JSON en body

// Rutas principales
app.use('/invitados', invitadosRoutes);
app.use('/equipos', equiposRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('🚀 API funcionando correctamente');
});

// Arranque del servidor
const PORT = Config.PORT;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
