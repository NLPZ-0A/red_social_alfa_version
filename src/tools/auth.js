const db = require('../database/db_local');
const DB = require('../database/dbmodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



module.exports.login = async(req, res) => {
    
        const { email, password } = req.body
        const data = await DBmodel.getUserbyEmail(email);
            
        console.log(`los datos son ${ JSON.stringify(data)} y la cantidad de objetos ${data.length}`);

        const textJson = JSON.stringify(data);
        const usuario = JSON.parse(textJson)[0];

        const generarToken = (id) => {

            return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn:process.env.JWT_EXPIRES_IN});

        };

        //console.log(`contraseña valida ${await bcrypt.compare(password, usuario.password)}`);

        if(!(data.length < 1 || !(await bcrypt.compare(password, usuario.password)))){
            const token = generarToken(usuario.id);

            const opcionesDelCookie =  {
                expires:new Date(
                    Date.now() + process.env.JWT_COOKIE_EXPIRES*24*60*60*1000
                ),
                httpOnly:true//no pueda acceder a la cookie desde el frontend
            };

            //poner cookies en el browser...
            res.cookie('login', token, opcionesDelCookie);

            console.log('redireccion');

            return res.status(200).redirect('/home');
            
        }
   
    
   
};

