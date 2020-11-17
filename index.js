// [Varios]
const chalk = require('chalk');
require('dotenv').config();

// [Express]
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

// [Base de datos]
const db = require('./database/config');
db();

// [Configuraciones]
app.use(require('cors')());
app.use(express.json());
app.use(express.static('public'));

// [Rutas]
app.get('/', (req, res) => {
    res.json({ Welcome: 'Bienvenidos al servidor!!' })
})

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/semaforos', require('./routes/semaforos.routes'));

// [MQTT]
const mqttConnect = require('./mqtt/mqttConnect');
mqttConnect(server);

// [Ejecucion de servidor]
server.listen(port, () => {
    console.log(chalk.blue('[Desarrollador]') + ' - Equinoccio Technoloy | Tel: 2664869642 | CEO Ing. Lucas Omar Moreno');
    console.log(chalk.blue('[Express]') + ` - Servidor escuchando en http://localhost:${port}`);
})
