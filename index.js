const express = require('express');
require('dotenv').config();
var cors = require('cors');

const { dbConnection } = require('./database/config');

// Crear el servidor express
const app = express();

// Configurar cors
app.use(cors());

// Base de datos
dbConnection();

// Rutas
app.get('/',(req, res) => {
  res.status(200).json({
    ok: true,
    msg: 'hola mundo'
  });
});

app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
});
