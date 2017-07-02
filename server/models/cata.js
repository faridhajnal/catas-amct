'use strict';
// load the things we need
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const Catador = require('./catador');
const Tequila = require('./tequila');


var scoreGroup = {
    category : Number,
    total : Number,
    _id : false,
    tequila : {type : Schema.Types.ObjectId, ref: 'Tequila'},
    evaluator : { type: Schema.Types.ObjectId, ref: 'Catador' }
}


var cataSchema = mongoose.Schema({
      name : String,
      place : String,
      kind : Number,
      status : {type:Number, default : 1},
      participants : [{ type: Schema.Types.ObjectId, ref: 'Catador'}],
      tequilas : [{type : Schema.Types.ObjectId, ref: 'Tequila'}],
      scores : [scoreGroup]
});

module.exports = mongoose.model('Cata', cataSchema);
