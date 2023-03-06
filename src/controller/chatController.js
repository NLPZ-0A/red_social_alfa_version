const User = require('../models/User');
const Message = require('../models/Messages');

const userInstance = new User();
const messageInstance = new Message();

const chatApp = async(req, res) =>{
    try{
        const currentUser = req.usuario;
        const friends = await userInstance.getFollowedsUsers(currentUser.id);
     
        return res.render('chat', {currentUser:currentUser , friends :friends, layout: false});
    }catch(err){
        console.log(err);
        return res.status(403).send({message : 'error'});
    }
};


const responseChat = async(req, res) =>{
    try{

        const currentUser = req.usuario;
        const to_user_id = req.params.id;

        const messageBetweenUsers = await messageInstance.getMessagesBetweenUsers(currentUser.id, to_user_id);
 
        if(!messageBetweenUsers){
            return res.status(400).send({message : 'no existen estos mensajes'});
        }

        const messages = messageBetweenUsers;

        return res.status(200).send(messages);

    }catch(err){
        console.log(err);
        return res.status(503).send({message : 'error'});
    }
};

module.exports = {chatApp, responseChat}