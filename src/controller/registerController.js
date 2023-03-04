const User = require = ('../models/User');
const auth_mail = require('../tools/auth_mail');
const bcrypt = require('bcrypt');


const register = async(req, res)=>{

        console.log('registrando');
        const {name, username, email, password} = req.body;
        const salt = 8;
       
        try{
            const encryptedPassword = await bcrypt.hash(password, salt);
            const user = new User(name, username, email, encryptedPassword);
            const data = {name, username, email};

            auth_mail.sendConfirmation(data);

            const saveUser = await user.saveUser()

            res.status(200);

        }catch(err){
            throw err;

            res.status(500);
        }

}

module.exports = {register}