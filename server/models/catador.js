'use strict';
// load the things we need
const mongoose = require('mongoose');

// define the schema for our user model
var catadorSchema = mongoose.Schema({
      name : String,
      email : String,
      password : String,
      group : Number,
      isAdmin : {type: Boolean, default : false}
}
,{
   timestamps: false
 }
);

module.exports = mongoose.model('Catador', catadorSchema);
