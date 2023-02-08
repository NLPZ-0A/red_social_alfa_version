const User = require('../models/User');
const Post = require('../models/post')
const bcrypt = require('bcrypt')
const { parseDate } = require('../tools/get_date_now');
const auth_mail = require('../tools/auth_mail');
const { getToken, getTokenData } = require('../config/jwt.config');
const parseSQL = require('../tools/parseSQL');
const jwt = require('jsonwebtoken');

const userInstance = new User();
const postInstance = new Post();

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
        res.status(500).json({message: "error de servidor"});
    }

};

const login = async(req, res) => {
   
    try{
    
        if(!req.cookies.login){
            const { email, password } = req.body;
            const data = await userInstance.getUserbyEmail(email);
            const usuario = data[0];
            console.log(usuario);
            const id = usuario.id;


            if (data.length > 0 && (await bcrypt.compare(password, usuario.password))) {
                
                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN,
                });
                console.log(token);
                const opcionesDelCookie = {
                    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                    httpOnly: true,
                };
                res.cookie('login', token, opcionesDelCookie);
                res.status(200);
                return res.redirect('/home');

            }
            res.statusMessage="contraseña incorrecta";
            return res.status(403).end();
        }

       return res.redirect('/home');
}catch(err){
    console.log(err);
    res.render.status(500);
}

    
};

const logout = async(req, res)=>{
    try{
        res.cookie('login','',{maxAge:1});
        return res.status(200).redirect('/login');
    }catch(err){
        throw err;
        res.status(500).json({message: "error de servidor"});
    }
};

const home =  async (req, res)=>{
    
    try{
        const currentUser = req.usuario;
        const postsFilter = await postInstance.getFriendsPostFeed(req.usuario.id);
        const postsObject = parseSQL(postsFilter);

        const postsWithLikes = await Promise.all(postsObject.map(async post => {
            //const likes = await postsFilter.getLikes(currentUser.id);
            const likes = await postInstance.getLikeforPost(post.id);  
            const likesReq = await postInstance.getLikes(post.id);
            const likesCount = likesReq[0].likes;
            const iLikePost = likes.some(like => like.user_id === currentUser.id);
            return { ...post, iLikePost, likesCount};

        }));

        const posts = parseDate(postsWithLikes);
        
        res.render('home', {title:'blog', user : req.usuario, currentUser:currentUser , posts: posts });
    }catch(err){
        throw err;
        res.status(500).json({message: "error de servidor"});
    }
};

const ConfirmAccount = async (req, res) =>{

        try {
            //obtenemos el token
            const { token } = req.params;
        
            //verificamos la data
            const data = await getTokenData(token);

            console.log(`la data es: ${data}`);

            if(data === null){
               return res.json({
                 succes: false,
                 message: 'Error al obtener data'
               });
            }

            //verificar exostencia del usuario
            const { email } = data;

            const user = await userInstance.getUserbyEmail(email) || null;
            if(user === null){
                return res.json({
                    succes: false,
                    message: 'usuario no existente'
                });
            }
            
            //actualizas el usuario
            await userInstance.updateUser(email);
            //redireccionar a la confirmacion 
            return res.redirect('/confirmacion');
            
        } catch (error) {
            console.log(error);

            return res.json({
                success: false,
                message: error
            });
        }
};

module.exports = {register,
                  login,
                  logout,
                  home,
                  ConfirmAccount};