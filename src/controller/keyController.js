const User = require('../models/User');
const Conversation = require('../models/Conversations');


const conversationInstance = new Conversation();

const getKey = async(req, res) =>{
    try{
        const user_id = req.usuario.id;
        const to_user_id = req.params.id;
        console.log('obteniendo conversacion');
        console.log(to_user_id);
        const conversation = await conversationInstance.getConversationBetweenUsers(user_id, to_user_id);

        return res.status(200).send({key:conversation[0].key_assigned});
    }catch(err){
        console.log(err);
        return res.status(403).send({message : 'error'});
    }
};

module.exports = {getKey};