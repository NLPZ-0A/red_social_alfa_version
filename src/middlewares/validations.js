const User = require('../models/User');
const validator = require('validator');
const passwordValidator = require('password-validator');

const userInstance = new User();

//crear schema
const schema = new passwordValidator();


//añadir las propiedades contraseñas
schema
    .is().min(8)
    .is().max(75)
    .has().not().spaces()


module.exports.validatorRegister = async (req, res, next)=>{
    
    try{
         console.log(req.body);
        const message = await formValidation(req.body);

        if(message !== true){
            console.log('error en el proceso de registro');
            console.log(req.body.email);
            console.log(req.body.username);
            console.log(req.body.nombre);
    
            console.log(message);
            res.statusMessage=message;
            return res.status(403).end();
        }else{
            next();
        }

    }catch(err){
        console.log(err);
        throw err;
    }
};

module.exports.validatorLogin = async (req, res, next) => {
    
    try{
         console.log(req.body);
        const message = await loginValidation(req.body);
        console.log('dentro');
        console.log(message);
        if(message !== true){
            console.log('error en el proceso de login');
        
            //res.statusMessage = message;
            //res.locals.message = message;
            return res.status(403).json({errorMessage : 'ha ocurrido un error'});
        }else{
            console.log('next');
            next();
        }
    }catch(err){
        throw err;
    }
}

const loginValidation = async (data) => {
    try{
        if(Object.values(data).length){
            const {email, password} = data;

            if(validator.isEmpty(String(email)) || validator.isEmpty(String(password))){
                return 'No se permiten campos vacios';
            }

            if(!validator.isEmail(String(email))){
                return 'Email invalido';
            }

            //-----------------usuarios-----------------------------

            const user = await userInstance.getUserbyEmail(email);

            if(user.length === 0)
                return 'Correo no  registrado';
            }

            return true;

    }catch(err){
        throw err;
    }
    
};

const formValidation = async (data) => {
    try{
        console.log(data);
        if(Object.values(data).length){
            const {name, username, email, password} = data;
            //console.log(name);
            //inputs vacios
            if(validator.isEmpty(String(name)) || validator.isEmpty(String(username)) || validator.isEmpty(String(email)) || validator.isEmpty(String(password))){
                return 'Empty field not allowed';
            }

            //formato del email
            if(!validator.isEmail(email)){
                return 'Email format is not valid';
            }

            //formato de la contraseña
            if(!schema.validate(password)){
                return 'invalid passsword';
            }

            //palabras prohibidas en la contraseña
            if(validator.contains(password.toLowerCase(), "password")){
                return "invalid password";
            }



            //duplicacion
            let usuario = await userInstance.getUserbyUsername(username);
            let correo = await userInstance.getUserbyEmail(email);

            if(usuario.length > 0){
                return 'username alredy exist';
            }else if(correo.length > 0){
                return 'email alredy exist';
            }

            //si todo esta bien;
            return true;
        }
    
    return "no data";

}catch(err){

    console.log(err);
    throw err;
}

};