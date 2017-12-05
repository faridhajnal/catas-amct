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
const json2xls = require('json2xls');
const fs = require('fs');
const pdf = require('html-pdf');
const aws = require('aws-sdk');
const AWS = require('../mlabinfo').AWS;
//const S3_BUCKET = AWS.bucket; //dev
const S3_BUCKET = process.env.S3_BUCKET; //prod
aws.config.update({region: 'us-east-2'});
//process.env.AWS_ACCESS_KEY_ID = AWS.key; //dev
//process.env.AWS_SECRET_ACCESS_KEY = AWS.secret; //dev
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
        if(tequila === null || tequila === undefined){
            return res.json({error: "Ya no hay tequilas por calificar"});
        }
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
                return res.status(401).send("Unauthorized");
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
        if(!status || (status < 0 || status > 3) || (status == cata.status)) return res.status(400).send('Estatus inválido');
        cata.status = status;

        if(status == 3){
            cata.results = calculateResultsForCata(cata.scores);
        }

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

router.get('/:id/score', (req, res)=>{
    let id = req.params.id;
    let mode = req.query.mode;
    Cata.findById(id).populate('results.tequila').exec((err, cata)=>{
        if(err) res.json({err});
        if(!cata || cata.results.length === 0) return res.status(404).send();
        let simplified = cata.results.map((r)=>{
            return {
                average : r.average,
                rank : r.rank,
                cup : r.cup,
                tequila : r.tequila.name
            };
        });
        if(mode == 0){
            let formattedResults = formatResultsJsonArray(simplified);
            console.log('formattedResults', formattedResults);
            const xls = json2xls(formattedResults);
            //fs.writeFileSync('results.xlsx', xls, 'binary');
            const buf = new Buffer(xls, 'binary');
            const fileName = cata.name + '.xlsx';
            const s3 = new aws.S3();
            let uploads3Params = {
              Body: buf,
              Bucket: S3_BUCKET,
              Key: fileName,
              ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            };
        
            let gets3Params = {
              Bucket: S3_BUCKET,
              Key: fileName,
              Expires : 60
            };
        
            s3.putObject(uploads3Params, (err, data)=> {
              if (err) {
                console.log(err, err.stack);
                return res.json({err: "Error generando archivo " + err});
              } // an error occurred
              else    {
                console.log(data);
                const url = s3.getSignedUrl('getObject', gets3Params);
                return res.json(url);
              }
            });
        }

        else{
            let html = getHtmlFromJson(simplified);
            const options = { format: 'Letter' };
            pdf.create(html).toBuffer(function(err, buffer){
               console.log('This is a buffer:', Buffer.isBuffer(buffer));
               const fileName = "ejemplo" + '.pdf';
               const s3 = new aws.S3();
               let uploads3Params = {
                 Body: buffer,
                 Bucket: S3_BUCKET,
                 Key: fileName,
                 ContentType: 'application/pdf'
               };
           
               let gets3Params = {
                 Bucket: S3_BUCKET,
                 Key: fileName,
                 Expires : 60
               };
           
               s3.putObject(uploads3Params, (err, data)=> {
                 if (err) {
                   console.log(err, err.stack);
                   return res.json({err: "Error generando archivo " + err});
                 } // an error occurred
                 else    {
                   console.log(data);
                   const url = s3.getSignedUrl('getObject', gets3Params);
                   return res.json(url);
                 }
               });
            });
        }
        
        //return res.json(simplified);
    });
});

router.post('/export/pdf', (req, res)=>{
     
});

function getHtmlFromJson(resultsArray){
    const markup = `
        <html>
        <body>
            <ul>
                ${resultsArray.map(result=> `<li><h1>${result.tequila}</h1><h3>${result.average}</h3></li>`)}
            </ul>
        </body>
        </html>
    `
    return markup;
}

function formatResultsJsonArray(results){
    
        let formattedResults = [];
        let index = 1;
        results.forEach(result=>{
            formattedResults.push({
            'Lugar' : index,
            'Tequila' : result.tequila,
            'Promedio' : result.average,
            'Copa' : result.cup
          });
          index++;
        });
    
        return formattedResults;
    
    }

function calculateResultsForCata(scores){
    let averagedResults = [];
    let grouped = _.groupBy(scores, 'tequila');
    let index = 0;
    for (let key in grouped){
        let theImportantStuff = grouped[key];
        let avg = getAverageForTequila(theImportantStuff);
        let score = {
            average : avg,
            rank : 0,
            tequila : key,
            cup : ++index
        }
        averagedResults.push(score);
    }
    averagedResults.sort((a,b)=> a.average - b.average).reverse();
    
    for(let i = 0; i < averagedResults.length; i++){
        averagedResults[i].rank = i + 1;
    }
    console.log('nice', averagedResults);
    return averagedResults;
}

function getAverageForTequila(tequilaInfo){
    let averageScore = tequilaInfo.map(element => element.total).reduce((sum, a)=> { return sum + a },0)/ tequilaInfo.length;
    return averageScore;
}



module.exports = router;
