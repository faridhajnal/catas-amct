'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');
const router = express.Router();
const SOCKET_PORT = 4000;
const Catador = require('../models/catador');
const Tequila = require('../models/tequila');
const Cata = require('../models/cata');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
app.io = io;
server.listen(SOCKET_PORT, "127.0.0.1", 0, ()=>{
    console.log(`socket up and running @ ${SOCKET_PORT}`);
});

io.on('connection', (socket) => {
  console.log('The user is connected');
  socket.on('disconnect', function(){
    console.log('The user is disconnected');
  });
  socket.on('emit-msg', function(message){
      socket.broadcast.emit('evento', {
          type : message.type,
          user : message.user
      });
  });
});


router.get('/available/:status/:userId', (req,res)=>{

    let status = req.params.status;
    let user_id = req.params.userId;
    let query = Cata.find({status:status , participants: { $nin : [user_id]}}).select('-scores -tequilas');
    query.exec((err, result)=>{
      if(err) res.status(500).send(err);
      //setTimeout(()=>{
        res.json(result);
      //},3000)
    });

});


router.get('/registered/:userId', (req,res)=>{

  let user_id = req.params.userId;
  let query = Cata.find({participants: { $in : [user_id]}}).select('-scores -tequilas');
  query.exec((err, result)=>{
    if(err) res.status(500).send(err);
    //setTimeout(()=>{
        res.json(result);
    //},2000)
  });

});



/* Enroll catador into cata */

router.post('/:id/catador', (req,res)=>{
    let cata_id = req.params.id;
    let catador = mongoose.Types.ObjectId(req.body.catadorId);
    Cata.findById(cata_id, (err, cata)=>{
        if(!cata) return res.status(404).send();
        for(let participant of cata.participants){
            if(participant.equals(catador)) return res.status(401).send('usuario ya es parte de la cata');
        }
        cata.participants.push(catador);
        cata.save((err, result)=>{
            if(err) return res.status(500).send('Internal Server Error');
            app.io.emit('evento', {type: 1, name: req.body.catadorName});
            return res.status(200).json({msg:'Insertado bien'});
        });
    });
});

/* Add score by catador, for tequila */

router.post('/:id/score', (req,res)=>{
    let cata_id = req.params.id;
    let score = req.body.score;
    Cata.findById(cata_id, (err, cata)=>{
        if(err) return res.json({err});
        if(!cata) return res.status(404).send('Cata invalida');
        let tequila = cata.tequilas[score.index - 1];
        cata.scores.push({
            total : score.total,
            evaluator : score.userId.toString(),
            tequila : tequila
        });
        cata.save((err, result)=>{
            if(err) console.log(':(', err);
            return res.json({message:'score insertado chingon'});
        });


    });

});


router.get('/verify/:id/:catadorId', (req,res)=>{
    Cata.findById(req.params.id, (err,cata)=>{
        if(err) return res.status(500).send('Internal Server Error');
        let scores = cata.scores.filter(function(score) {
            return score.evaluator == req.params.catadorId;
        });
        if(scores.length === cata.tequilas.length) {
            return res.status(401).json({message:'Ya has enviado resultados'});
        }
        else return res.status(200).json({});
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

/* Get Catas Basic Info */

router.get('/', (req,res)=>{
    Cata.find({}).select('-participants -tequilas -scores').exec((err,record)=>{
        if(err) res.json({err});
        if(!record) return res.status(404).send();
        res.send(record);
    });
});


/* Get Cata by Id, with everything populated (Admin) */
router.get('/:id', (req,res)=>{
    let id = req.params.id;
    Cata.findById(id).populate('participants tequilas').exec((err,record)=>{
        if(err) res.json({err});
        if(!record) return res.status(404).send();
        res.send(record);
    });
});

/* Get scores by category / catador / tequila (Admin) */

router.get('/:id/:type/:value', (req,res)=>{
    let cata_id = req.params.id;
    let type = req.params.type; //category, tequila, evaluator
    let value = req.params.value;
    let results = [];
    Cata.findById(cata_id, (err, cata)=>{
        if(err) return res.json({err});
        if(!cata) return res.status(404).send('Cata invalida');
        for(let score of cata.scores){
            if(score[type] == value) results.push(score);
        }
        return res.send(results);
    });
});

/* Register new Cata (Admin) */

router.post('/', (req,res)=>{

    let body = req.body.cata;

    let cata = new Cata({
        name : body.name,
        place : body.place,
        kind : body.kind,
        participants : [],
        tequilas : [],
        scores : []
    });

    cata.save((err, result)=>{
        if(err) return res.status(500).send('Internal Server Error');
        return res.json({msg:'Agregado satisfactoriamente'});
    })
});

/* Add tequila to cata (Admin) */

router.post('/:id/tequilas', (req,res)=>{
    let cata_id = req.params.id;
    let tequilas = req.body.tequilas;
    Cata.findById(cata_id, (err, cata)=>{
        if(!cata) return res.status(404).json();
        cata.tequilas = [];
        for(let teq of tequilas){
            let tequilaIdMongo = mongoose.Types.ObjectId(teq);
            cata.tequilas.push(tequilaIdMongo);
        }

        cata.save((err, result)=>{
            if(err) return res.status(500).send('Internal Server Error');
            return res.status(201).json();
        });
    });
});

/* Change Existing Cata status (admin) */

router.patch('/:id/:status', (req,res)=>{
    let status = req.params.status;
    let cata = Cata.findById(req.params.id, (err,cata)=>{
        if(err) return res.status(500).send(err);
        if(!status || (status < 0 || status > 3)) return res.status(400).send('Estatus inválido');
        cata.status = status;
        cata.save((err,result)=>{
            if(err) return res.status(500).send(err);
            return res.status(200).json({message:'Actualizado satisfactoriamente'});
        });
    });
});

router.patch('/:id', (req,res)=>{
    let newInfo = req.body.data;
    let id = req.params.id;
    Cata.update({_id:id}, {
        name : newInfo.name,
        place : newInfo.place,
        kind : newInfo.kind
    }, (err,result)=> {
        if(err) {console.log(err); return res.status(500).send(err)};
        res.json(result);
    });
});

module.exports = router;
