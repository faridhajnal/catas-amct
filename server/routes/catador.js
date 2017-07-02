'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const router = express.Router();
const Catador = require('../models/catador');
/* Enroll catador into cata */

router.post('/login', (req,res)=>{
    Catador.findOne({email: req.body.email}, (err,user) => {
        if(err){
            return res.status(500).json({
                title : 'error occured',
                error: err
            });
        }
        if(!user || !bcrypt.compareSync(req.body.password, user.password)){
            return res.status(404).json({
                title : 'Error al iniciar sesión',
                error : { message : 'Sus datos son incorrectos'}
            });
        }

        if(bcrypt.compareSync(req.body.password, user.password)){
            return res.status(200).json({
                id : user._id,
                name : user.name,
                email : user.email,
                group : user.group,
                isAdmin : user.isAdmin
            });
        }

    });
});

router.post('/', function (req, res, next) {
    var usr = new Catador({
        name : req.body.name,
        email : req.body.email,
        password : bcrypt.hashSync(req.body.password, 10), //one way, cannot be decrypted
        group : req.body.group,
        isAdmin : req.body.isAdmin ? req.body.isAdmin : false
    });

    usr.save((err, doc, num) => {
        if(err){
            return res.status(500).json({
                title : 'error occured',
                error: err
            });
        }
        res.status(201).json({
            message: 'User created',
            user_id: doc._id,
            count: num
        });
    })
});

router.patch('/:id/pwd', (req,res)=>{
    let user_id = req.params.id;
    let cp = req.body.currentpwd;
    let np = req.body.newpwd;
    Catador.findById(user_id, (err,catador)=>{
        if(err) return res.status(500).send(err);
        if(!catador || !bcrypt.compareSync(cp, catador.password)){
            return res.status(404).json({
                title : 'Acción fallida',
                error : { message : 'invalid credentials'}
            });
        }

        if(bcrypt.compareSync(cp, catador.password)){
            if(bcrypt.compareSync(np, catador.password)) return res.status(400).send('No mamar');
            catador.password = bcrypt.hashSync(np, 10);
            catador.save((err,result)=>{
                if(err) return res.status(500).send(err);
                return res.status(201).send();
            });
        }
    });
})

module.exports = router;
