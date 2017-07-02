'use strict';
const mongoose = require('mongoose');
//const credentials = require('../mlabinfo');
const env = process.env.NODE_ENV || 'development';
const nombre = "AMCT";
//mongoose.connect('mongodb://localhost/amct');
if(env === 'production'){
  mongoose.connect(process.env.MLABINFO);
}

else{
  mongoose.connect('mongodb://localhost/amct');
}

mongoose.connection.on('error', (err) => {
  console.log('Error conectando con la base de datos', err);
});

mongoose.connection.on('open', () => {
  console.log(`Conectado a base de datos ${nombre}`);
});

module.exports = mongoose;
