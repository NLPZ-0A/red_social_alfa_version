const User = require('../models/User');
const Conversations = require('../models/Conversations');
const Notifications = require('../models/notifications');
const Message = require('../models/Messages');
const cookie = require('cookie');


const userInstance = new User();
const conversationInstance = new Conversations();
const notificationsInstance = new Notifications();

module.exports = (io) => {

    let users = [];
    const unreadMessages = {};

    io.on('connection', (socket) => {
        console.log('Un nuevo socket se ha conectado ');


        socket.on("user_connected", async function(username) {

            let currentUser = await userInstance.getUserbyUsername(username);
            let friends = await userInstance.getFollowedsUsers(currentUser[0].id);
            let flag = true; // Variable de apoyo para romper el bucle

                //users[username] = socket.id;
               

              // esto se hace con la finalidad de que no se envíen eventos
              // y se registren datos en nuestro objeto innecesarios que
              // luego no podremos borrar
              for(let i = (users.length - 1); i >= 0; i--){
                  // Si ese socket ya ha sido registrado, entonces no procede
                  if(users[i].socketId === socket.id){
                      flag = false;
                      break;
                  }
              }

              // Si no se ha registrado el socket, se agrega al objeto
              if(flag){
                const nuevo = {
                    socketId: socket.id,
                    username: username
                }
                users.push(nuevo);
                console.log("Nuevo usuario registrado: ", users);

                console.log('usuarios:');
                console.log(users);
            }
           
            io.emit("user_connected", username);

            for (i in users){
              if(users[i].username === username){
                if(unreadMessages){
                  io.to(users[i].socketId).emit('unread',  unreadMessages[username]);
                  console.log(unreadMessages);
                }
                }
              } 

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

           console.log(data.receiver);
           console.log(users);


           // Incrementar el contador de mensajes no leídos para el chat correspondiente
          

                for (i in users){
                  if(users[i].username === data.receiver){
                      io.to(users[i].socketId).emit('nuevo mensaje', {
                        
                        msg: data.message,
                        user : data.sender.user,
                        receiver : data.receiver
                      });
                      
                      let reqNotify = await notificationsInstance.getLastNotifications(to_user_id);
                    
                      let lastNotify= reqNotify[0];
                      io.to(users[i].socketId).emit('notify', {lastNotify, time:'ahora'});

                      if(!unreadMessages[data.sender.user.username]) {
                        unreadMessages[data.sender.user.username] = 0;
                      }
                      unreadMessages[data.sender.user.username]++;

                      console.log(unreadMessages);
                    }
                  }

                  for (i in users){
                    if(users[i].username === data.sender.user.username){
                        io.to(users[i].socketId).emit('nuevo mensaje', {
                          
                          msg: data.message,
                          user : data.sender.user,
                          receiver : data.receiver
                        });
                      }
                    } 
        });

       
        // Manejar el evento de leer mensajes
        socket.on('read', (chatId) => {
            // Reiniciar el contador de mensajes no leídos para el chat correspondiente
            unreadMessages[chatId] = 0;
        });


      // Se dispara cuando el socket se ha desconectado
        socket.on('disconnect', ()=> {
          // Se elimina el socket que se ha desconectado del objeto
         users = users.filter(item=>{
              if(item.socketId != socket.id){
                  return item;
              }else{
                  console.log("Usuario retirado");
              }
          });
      });


       
    });       
      
}; 
        