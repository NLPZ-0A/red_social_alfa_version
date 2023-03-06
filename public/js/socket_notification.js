$(document).ready(()=>{

    const socket = io();

socket.on('notify', (data)=>{
            console.log(data);
            console.log('holamundo');
            let notification = data.lastNotify;
            renderNotifications(notification, data.time);
         });

const getData = async () => {
        console.log('getData() se ha llamado.');
        const response = await fetch(`${window.location.origin}/getCurrentUser`);
    
        if(response.status === 200){
            const user = await response.json();
            return user;
          }
    
          return;
        };

const renderNotifications = (notification, time) =>{
        

            let profileImage ;
            
            console.log(notification);
            console.log('rendereando....');
            let boxNotify = $('.boxNotifyUL');
    
            console.log(notification.sender_image);
    
    
            if(!notification.sender_image){
                    profileImage = '/img/user.png';
            }else{
                    profileImage = `/files/${notification.sender_image}`;
            }
    
            let blockNotify = `  
                <div class="notify" data-id="${notification.id}">
                    <div class="notify-content" id="notify${notification.id}">
                        <a href="/profile/${notification.sender_username}"><img src="${profileImage}" alt="img-avatar"  class="image-notify"> </a>
                        <p><a href="#" style="color:rgb(22, 22, 22)">${notification.sender_username} te ha enviado un mensaje! </a>  <strong>${time}</strong></p>
                    </div>
                </div>
                    <hr>
                `;
            let view =` <div class="dot"></div>`;
    
            boxNotify.prepend(blockNotify);
            console.log('added');
            let notifyContent = $(`#notify${notification.id}`);
            if(notification.isread === 0){
                notifyContent.append(view);
            }       
    
                    
            
};        
        

const connection = async() => {

   let data = await getData();
  
  socket.emit("user_connected", data.user.username);  
    
};

( async function(){
     await connection();
})();


});
