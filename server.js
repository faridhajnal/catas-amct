let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
const path = require('path');
const bodyParser = require('body-parser');
const dbconf = require('./server/config/db');
const PORT = process.env.PORT || 3000;
var cataRoutes = require('./server/routes/cata');
var catadorRoutes = require('./server/routes/catador');
var tequilaRoutes = require('./server/routes/tequila');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/cata', cataRoutes);
app.use('/catador', catadorRoutes);
app.use('/tequila', tequilaRoutes);

app.get('*', (req, res) => {	
   res.sendFile(path.join(__dirname, 'dist/index.html'));
});

console.log("PORT", PORT);

app.listen(PORT, ()=>{
    console.log(`app succesfully running @ ${PORT}`);
});
