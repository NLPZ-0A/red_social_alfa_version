const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const UserInstance = require('../models/User');

const User = new UserInstance();

module.exports.isLoggedIn = async (req, res, next) =>{
  
    if(req.cookies.login){
        //1) verificar nuestro token...
        const decoded = await promisify(jwt.verify)(req.cookies.login, process.env.JWT_SECRET);

        //2) parsear token
        const token_parseado= JSON.parse(JSON.stringify(decoded));

        //verificar si existe el usuario con el mismo id
        let usuario = await User.getUserbyId(token_parseado.id);

    

        if(usuario.length === 0) return res.redirect('/login');

        req.usuario = await usuario[0];
        console.log('islogged');
   

        return next();

    }else{

        res.redirect('/login');

    }

};