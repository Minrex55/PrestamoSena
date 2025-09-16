const express = require('express');
const cors = require('cors');
const app = express();
const porteroRoutes = require('./vista/PorteroRutas'); 

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/porteros', porteroRoutes);

// Ruta base
app.get('/', (req, res) => {
    res.send('API de Porteros funcionando');
});

// Iniciar el servidor
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});