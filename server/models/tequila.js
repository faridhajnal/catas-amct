'use strict';
// load the things we need
const mongoose = require('mongoose');

//grado de alcohol (integer)
//contenido neto (ml)

var tequilaSchema = mongoose.Schema({
      name : String,
      manufacturer : String,
      kind : String,
      price : Number
}
,{
   timestamps: false
 }
);

module.exports = mongoose.model('Tequila', tequilaSchema);
