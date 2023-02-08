require('dotenv').config();//Nos permite usar la informacion de nuesto env
const cookierParser = require('cookie-parser');
const express = require("express");
const db = require("./src/database/db");
const path = require('path');//manipulacion de los directorios
const bodyParser = require('body-parser');
const csurf = require('csurf');
//const xss = require('xss');

const app = express();//llamo al servidor


app.use(cookierParser());

//app.use(bodyParser.urlencoded({extended:true}));

const viewsPath = path.join(__dirname, './src/views')
app.use(express.urlencoded({ extended: true }));
app.engine('html', require('ejs').renderFile);
app.set('view engine','ejs');
app.set('views', viewsPath)

//const publicDir = path.join(__dirname, '/public');
app.use(express.static(__dirname + '/public'));
app.use(express.json());
//app.use(xss);



//-------------------------------csrf token--------------------------------------------------

/*app.use((req,res,next) =>{
  if(req.method === 'POST'){
    console.log(req.body);
  }
  next()
});*/

app.use(csurf({ cookie: { httpOnly: true, }}));

app.use(function(req, res, next) {
  res.locals.csrfToken = req.csrfToken();
  next();
});

/*
app.use((req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken())
  next()
})*/


/*app.use(function (req, res, next) {

  console.log(req.body);
  console.log('otra req');
  console.log(req.csrfToken());  
  console.log(req.headers._csrf);
  //console.(log"cabecera-csrf: " + req.headers._csrf );


    if (req.method === 'POST') {
      console.log(req.headers['csrf-token']);
      console.log(req.csrfToken());
      console.log(req.headers );
      if (req.headers._csrf !== req.csrfToken() ) {
        console.log(`token actual:${req.csrfToken()}`);
        console.log(`token recibido:${req.headers['csrf-token']}`);
        console.log(req.body);
        console.log('no se ha validado el csrf token');
        return res.status(400);
      }
    }


    console.log('entre al next');
    res.status(200);
    return next();
  });*/

const authRouter = require('./src/routes/authRouter.js');
const postsRouter = require('./src/routes/postsRouter.js');
const userRouter = require('./src/routes/userRouter.js');

app.use('/', userRouter);
app.use('/auth', authRouter);
app.use('/post', postsRouter);


//activo el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el puerto: ${PORT}`);
});