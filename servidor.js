const express = require('express');
const cors = require('cors');
const app = express();
const InvitadoRutas = require('./vista/InvitadoRutas');
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/invitado', InvitadoRutas);

app.get('/', (req, res) => {
    res.send('Funcionando');
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});