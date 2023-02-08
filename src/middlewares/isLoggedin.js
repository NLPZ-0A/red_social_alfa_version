const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const db=require('../database/db_local');
const DB=require('../database/dbmodel');


const DBmodel=new DB(db);

module.exports.isLoggedIn = async (req, res, next) =>{
  
    if(req.cookies.login){
        //1) verificar nuestro token...
        const decoded = await promisify(jwt.verify)(req.cookies.login, process.env.JWT_SECRET);

        //2) parsear token
        const token_parseado= JSON.parse(JSON.stringify(decoded));

        //verificar si existe el usuario con el mismo id
        let usuario = await DBmodel.getUserbyId(token_parseado.id);

    

        if(usuario.length < 1) return await next();

        req.usuario = await usuario[0];

        return await next();

    }else{

        res.redirect('/login');

    }

};