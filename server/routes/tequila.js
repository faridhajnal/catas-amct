'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const Tequila = require('./../models/tequila');
const Catador = require('./../models/catador');

router.post('/test', (req,res)=>{
    let data = req.body;
    let tequilas = [];
    data.forEach(record=>{
        tequilas.push(new Tequila({
            name : record.name,
            manufacturer : 'Genérico',
            kind : record.kind,
            price: Math.floor((Math.random() * 1000) + 100)
        }));
    });


    Tequila.insertMany(tequilas, (err,result)=>{
        if(err) return res.status(500).json({err});
        res.json({"mensaje":"Añadidos correctamente", "result":result});
    });

});


/* Middleware for adimns only */


router.use('/', (req,res,next)=>{

    let userId = req.get('Authorization');
    if(userId){
        Catador.findById(userId, (err,catador)=>{
            if(err) return res.status(500).send('Internal Server Error');
            if(catador && catador.isAdmin) {
                next();
            }
            else{
                return res.status(401).send();
            }
        });
    }
    else{
        return res.status(400).send();
    }
});


router.get('/', (req,res)=>{
    let kind = req.query.kind;
    if(!!kind && (kind>= 0 && kind <=3)){
        Tequila.find({kind}, (err,result)=>{
            if(err) return res.status(500).json({err});
            //console.log('chido');
            res.json(result);
        });
    }
    else{
        Tequila.find({}, (err,result)=>{
            if(err) return res.status(500).json({err});
            //console.log('chido');
            res.json(result);
        });
    }
});


router.post('/', (req,res)=>{
    let data = req.body;
    let tequila = new Tequila({
        name : data.name,
        manufacturer : data.manufacturer,
        kind : data.kind,
        price : data.price
    });
    tequila.save((err,result)=>{
        if(err) return res.status(500).json({err});
        res.json({"mensaje":"Añadido correctamente", "id":result._id});
    });

});

module.exports = router;