$(document).ready(()=>{
    

    const renderNotifications = (notification) =>{
        let profileImage ;

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
                    <p><a href="#" style="color:rgb(22, 22, 22)">${notification.sender_username} te ha enviado un mensaje! </a>  <strong>${notification.date_not}</strong></p>
                </div>
            </div>
                <hr>
            `;
        let view =` <div class="dot"></div>`;

        boxNotify.append(blockNotify);

        let notifyContent = $(`#notify${notification.id}`);
        if(notification.isread === 0){
            notifyContent.append(view);
        }

                
        
    };

    

    const getNotifications = async() => {
        let token = document.querySelector('meta[name="csrf"]').getAttribute('content');
        console.log('getData() se ha llamado.');
        const response = await fetch(`${window.location.origin}/notifications/getNotifications`,{
          credentials :'same-origin',
          method : 'POST',
          headers: {
            'X-CSRF-TOKEN': token
          }
        });
  
            if(response.status === 200){
                const notifications = await response.json();


                console.log(notifications.notifications);
                return notifications;
              }
  
          return;
        };


    const sendView = async(id) => {
            let token = document.querySelector('meta[name="csrf"]').getAttribute('content');
            console.log('getData() se ha llamado.');
            const response = await fetch(`${window.location.origin}/notifications/viewNotification/${id}`,{
              credentials :'same-origin',
              method : 'POST',
              headers: {
                'X-CSRF-TOKEN': token
              }
            });
      
                if(response.status === 200){
                    location.href='/chat';
                    return ;
                  }
      
              return;
            };

    getNotifications()
                    .then((notifications) =>{ console.log(notifications);
                            Object.values(notifications).map(notification => {
                                renderNotifications(notification);
                        });
                    });   


                    
    
    $(document).on('click','.notify', async function(){  
        id= this.getAttribute('data-id');
        sendView(id);
    });            
              
});