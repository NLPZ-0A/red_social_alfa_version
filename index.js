require('dotenv').config();//Nos permite usar la informacion de nuesto env
const express = require('express');
const cookierParser = require('cookie-parser');
const path = require('path');//manipulacion de los directorios
const expressLayouts =  require('express-ejs-layouts');
const csurf = require('csurf');
const compression = require('compression');

const app = require('./server');//llamo al servidor

app.use(compression())
app.use(cookierParser());

const viewsPath = path.join(__dirname, './src/views')
app.use(express.urlencoded({ extended: true }));
app.engine('ejs', require('ejs').__express);
app.engine('html', require('ejs').renderFile);
app.set('view engine','ejs');
app.set('views', viewsPath)

console.log('iniciando...');


//const publicDir = path.join(__dirname, '/public');
app.use(expressLayouts);
app.use(express.static(__dirname + '/public'));
app.use(express.json());
//app.use(xss);

//-------------------------------csrf token--------------------------------------------------
app.use(csurf({ cookie: { httpOnly: true, }}));

app.use(function(req, res, next) {
  res.locals.csrfToken = req.csrfToken();
  next();
});


//-------------------------------LLAMO AL ADMINISTRADOR DE RUTAS--------------------------------
require('./src/routes/managingRoutes')(app);


const http = require('http').Server(app);
const io = require('socket.io')(http);

require('./src/tools/sockets')(io);


//activo el servidor
const PORT = process.env.PORT || 3000;
http.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el puerto: ${PORT}`);
});