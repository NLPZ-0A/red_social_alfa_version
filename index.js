require('dotenv').config();//Nos permite usar la informacion de nuesto env
const express = require('express');
const cookierParser = require('cookie-parser');
const db = require("./src/database/db");
const path = require('path');//manipulacion de los directorios
const bodyParser = require('body-parser');
const expressLayouts =  require('express-ejs-layouts');
const csurf = require('csurf');

//const xss = require('xss');

const app = require('./server');//llamo al servidor

app.use(cookierParser());

app.use((req,res, next) =>{
    req.custom = ' realmentefuncado';
    next();
  }
)

const viewsPath = path.join(__dirname, './src/views')
app.use(express.urlencoded({ extended: true }));
app.engine('ejs', require('ejs').__express);
app.engine('html', require('ejs').renderFile);
app.set('view engine','ejs');
app.set('views', viewsPath)


//const publicDir = path.join(__dirname, '/public');
app.use(expressLayouts);
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

const authRouter = require('./src/routes/authRouter.js');
const postsRouter = require('./src/routes/postsRouter.js');
const userRouter = require('./src/routes/userRouter.js');
const profileRouter = require('./src/routes/profileRouter');
const configRouter = require('./src/routes/configRouter');
const commentsRouter = require('./src/routes/commentRouter');
const chatRouter = require('./src/routes/chatRoutes');
const notifyRouter = require('./src/routes/notificationsRouter');

app.use('/', userRouter);
app.use('/auth', authRouter);
app.use('/post', postsRouter);
app.use('/profile', profileRouter);
app.use('/config', configRouter);
app.use('/comments', commentsRouter);
app.use('/chat', chatRouter);
app.use('/notifications', notifyRouter);


const http = require('http').Server(app);
const io = require('socket.io')(http);

require('./src/tools/sockets')(io);


//activo el servidor
const PORT = process.env.PORT || 3000;
http.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el puerto: ${PORT}`);
});