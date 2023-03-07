const User = require('../models/User');
const Post = require('../models/post')
const Comment = require('../models/Comments')
const bcrypt = require('bcrypt')
const { parseDate } = require('../tools/get_date_now');
const auth_mail = require('../tools/auth_mail');
const { getTokenData } = require('../config/jwt.config');
const parseSQL = require('../tools/parseSQL');
const jwt = require('jsonwebtoken');
const moment = require('moment');
moment.locale('es');

const userInstance = new User();
const postInstance = new Post();
const commentInstance = new Comment();

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
        return res.status(200).json({message : 'se ha registrado correctamente'});

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
          
            return res.status(403).send({message :'contraseña incorrecta'});
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

        const friends = await userInstance.getFollowedsUsers(currentUser.id);

        const postsWithLikes = await Promise.all(postsObject.map(async post => {
            //const likes = await postsFilter.getLikes(currentUser.id);
            const likes = await postInstance.getLikeforPost(post.id);  
            const likesReq = await postInstance.getLikes(post.id);
            const likesCount = likesReq[0].likes;
            const iLikePost = likes.some(like => like.user_id === currentUser.id);
            return { ...post, iLikePost, likesCount};

        }));

        const posts = parseDate(postsWithLikes);
        
        res.render('home', {title:'blog', user : req.usuario, currentUser:currentUser , posts: posts, friends : friends, layout: false});
    }catch(err){
        throw err;
        res.status(500).json({message: "error de servidor"});
    }
};

const postView = async(req, res) =>{
    try{
        const currentUser = req.usuario;
        const post_id = req.params.id;
        const postReq = await postInstance.getPostById(post_id);
        const commentReq = await commentInstance.getCommentsByPost(post_id);
        
        const commentObject = parseSQL(commentReq);
        const postObject = parseSQL(postReq);

        const friends = await userInstance.getFollowedsUsers(currentUser.id);

        const likes = await postInstance.getLikeforPost(post_id);  
        const likesReq = await postInstance.getLikes(post_id)

        const likesCount = likesReq[0].likes;
        const iLikePost = likes.some(like => like.user_id === currentUser.id);

        const post= {
            postBody : postObject,
            likesCount : likesCount,
            iLikePost : iLikePost,
        }
        
        post.postBody[0].date = moment(post.postBody[0].created_at).local().fromNow();
        post.postBody[0].likesCount = likesCount;
        post.postBody[0].iLikePost = iLikePost;
        //console.log(post.postBody[0]);

        const commentsParsed = parseDate(commentObject);
        const likesComments = await commentInstance.getAllLikesComments();  

        const comments = await Promise.all(commentsParsed.map(async comment => {
            let iLikeComment = false;
            //const likes = await postsFilter.getLikes(currentUser.id);
            const likesComments = await commentInstance.getLikesCommentById(comment.id);  
            //const likesCommentReq = await commentInstance.getLikesCommentCount(comment.id);
            //const likesCount = likesCommentReq.likes;
            iLikeComment = likesComments.some(like => like.user_id === currentUser.id);

            return { ...comment, iLikeComment};

        }));

        
        //console.log(comments);
        
        res.render('postView' ,{title:'post', user : req.usuario, currentUser:currentUser , post: post.postBody[0], friends : friends, comments:comments, layout: false});
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

const getCurrentUser = async(req, res) => {
    try{
        const userReq =  req.usuario;
        const user =  req.usuario;
        const dataUser = {
            id : user.id,
            name  : user.name,
            username : user.username,
            image : user.image
        }
        //const user = JSON.stringify(userReq);
        
        return res.status(200).send({user: dataUser});
    }catch(err){
        console.log(err);
        return res.status(403).json({message : 'error al intentar encontrar el user'});
    }
};

module.exports = {register,
                  login,
                  logout,
                  home,
                  postView,
                  ConfirmAccount,
                getCurrentUser};