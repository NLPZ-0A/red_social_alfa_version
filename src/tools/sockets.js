const User = require('../models/User');
const Conversations = require('../models/Conversations');
const Notifications = require('../models/notifications');
const Message = require('../models/Messages');

const userInstance = new User();
const conversationInstance = new Conversations();
const messageInstance = new Message();

module.exports = (io) => {

    var users = [];
  
    io.on('connection', (socket) => {
        console.log('Un nuevo usuario se ha conectado');

          console.log("User connected", socket.id);

        socket.on("user_connected", async function(username) {

            let currentUser = await userInstance.getUserbyUsername(username);
            let friends = await userInstance.getFollowedsUsers(currentUser[0].id);
            
            users[username] = socket.id;
            console.log('usuarios:');
            console.log(users);
           
            io.emit("user_connected", username);

        });
      
        socket.on('enviar mensaje', async(data) => {
            console.log(`---------------Mensaje recibido: ${data}`);
            console.log(data);

            let socketId = users[data.receiver];
            let myIDSocket = users[data.sender.user.username];

            let conversation;
            const receiverData = await userInstance.getUserbyUsername(data.receiver);
            const user_id = data.sender.user.id;
            const to_user_id = receiverData[0].id;


            conversation = await conversationInstance.getConversationBetweenUsers(user_id, to_user_id);

            console.log(!conversation);
            if(!conversation.length){
              console.log('creando conversacion!');
              const newConversations = new Conversations(user_id, to_user_id);
              const saveConversation = await newConversations.saveConversation();
              conversation = await conversationInstance.getConversationBetweenUsers(user_id, to_user_id);
            }

            let conversation_id = conversation[0].id;

            const newMessage = new Message(conversation_id, to_user_id, user_id, data.message);
            const saveMessage = await newMessage.saveMessage();

            const newNotification = new Notifications(to_user_id, user_id , data.message);
            const saveNotifications =  newNotification.saveNotification();
            
            
            console.log('socket token:');
            console.log(socketId);

           // io.to(socketId).emit('enviar mensaje', data);

                io.to(socketId).emit('nuevo mensaje',{
                        
                        msg: data.message,
                        user : data.sender.user,
                        receiver : data.receiver
                });

                io.to(myIDSocket).emit('nuevo mensaje',{
                        
                  msg: data.message,
                  user : data.sender.user,
                  receiver : data.receiver
                });

               
        });

       
    });       
      
}; 
        