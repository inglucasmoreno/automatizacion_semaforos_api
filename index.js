// [Varios]
const chalk = require('chalk');
const { response } = require('express');
require('dotenv').config();

// [Express]
const express = require('express');
const app = express();
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

app.use('/api/usuarios', require('./routes/usuarios.routes'));

// [Ejecucion de servidor]
app.listen(port, () => {
    console.log(chalk.blue('[Desarrollador]') + ' - Equinoccio Technoloy | Tel: 2664869642 | CEO Ing. Lucas Omar Moreno');
    console.log(chalk.blue('[Express]') + ` - Servidor escuchando en http://localhost:${port}`);
})
