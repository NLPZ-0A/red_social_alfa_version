$(document).ready(()=>{

    const socket = io();
    var user;
    var receiver = [];

$(document).on('click','#sendMessage', async function(){
        let User = await getData();
       
        const text = document.querySelector('#textAreaExample2').value;
        console.log(text);


        sendMessageSocket(User, text);

        document.querySelector('#textAreaExample2').value = '';
});

$(document).on('click','.user-friend', async function(){
        let id = this.id ;
        console.log(id);
        const currentUser = getData();


        $(`.user-friend`).css("background-color", "white");
        $(`#${id}`).css("background-color", "#ebebeb");
       

        let chatContainer = $('.list-unstyled.chat');

        $('.list-unstyled.chat').html('');

        this.getAttribute('name')

        receiver.pop();
        receiver.push(this.getAttribute('name'));  

      let messages = await getMessages(id);
      let getKeyCipher = await getKey(id);

      console.log(getKeyCipher.key);

      let key = getKeyCipher.key;

      $('#box-welcome').removeClass('active');
      $('.chat').addClass('active');
      

getMessages(id)
               .then(( messages) =>{ console.log(messages);
                Object.values(messages).map(message => {
              
            if(message.sender_image){
                profileImage = `/files/${message.sender_image}`
              }else{
                profileImage = '/img/user.png';
              }  

            let decryptMessageBin = CryptoJS.AES.decrypt(message.message, key);
            const decryptMessage = decryptMessageBin.toString(CryptoJS.enc.Utf8);

            let herMessage =`<li class="d-flex justify-content-between mb-4">
                            
                                <img src="${profileImage}" alt="avatar"
                                  class="rounded-circle d-flex align-self-start me-3 shadow-1-strong" width="60">
                                <div class="card w-100">
                                  <div class="card-header d-flex justify-content-between p-3">
                                    <p class="fw-bold mb-0">${message.sender_name}</p>
                                    <p class="text-muted small mb-0"><i class="far fa-clock" style="font-size:16px;"></i> 10 mins ago</p>
                                  </div>
                                  <div class="card-body">
                                    <p class="mb-0">
                                      ${decryptMessage}
                                    </p>
                                  </div>
                                </div>
                              
                              </li>`    


            let myMessage =`<li class="d-flex justify-content-between mb-4" id='message' name="${message.sender_name}">
                              <div class="card w-100">
                                <div class="card-header d-flex justify-content-between p-3">
                                  <p class="fw-bold mb-0" id="username-text">${message.sender_name}</p>
                                  <p class="text-muted small mb-0"><i class="far fa-clock" style="font-size:16px;"></i> 13 mins ago</p>
                                </div>
                                <div class="card-body">
                                  <p class="mb-0">
                                    ${decryptMessage}
                                  </p>
                                </div>
                              </div>
                              <img src="${profileImage}" alt="avatar"
                                class="rounded-circle d-flex align-self-start ms-3 shadow-1-strong" width="60">
                            </li>`;

            if(Number(message.sender_id) === Number(id)){
              chatContainer.append(herMessage); 
            }else{
             
              chatContainer.append(myMessage);
            }

          });   


  });                                                                         
    
});

socket.on('nuevo mensaje', async(data) =>{

        let messages = document.querySelectorAll('#message');
        let user = data.user;
        let currentUser = await getData();
        

        console.log(data.msg);


        let friends = document.querySelectorAll('.user-friend');
    let id_receiver;

      friends.forEach(element =>{
        console.log(element.getAttribute('name'));
          if(element.getAttribute('name') === receiver[0]){
            id_receiver = element.id;
          }
        });

        console.log(id_receiver);

        let getKeyCipher = await getKey(id_receiver);

        console.log(getKeyCipher.key);

        let key = getKeyCipher.key;

        let decryptMessage = CryptoJS.AES.decrypt(data.msg, key);
        const decryptedText = decryptMessage.toString(CryptoJS.enc.Utf8);

        let mensaje = decryptedText;
        let profileImage;
        
        if(user.image){
          profileImage = `/files/${user.image}`
        }else{
          profileImage = '/img/user.png';
        }

        let chatContainer = $('.list-unstyled.chat');


        let myMessage =`<li class="d-flex justify-content-between mb-4 ${user.username}-chat" id='message' name="${user.username}">
                        <div class="card w-100">
                          <div class="card-header d-flex justify-content-between p-3">
                            <p class="fw-bold mb-0" id="username-text">${user.username}</p>
                            <p class="text-muted small mb-0"><i class="far fa-clock" style="font-size:16px;"></i> 13 mins ago</p>
                          </div>
                          <div class="card-body">
                            <p class="mb-0">
                              ${mensaje}
                            </p>
                          </div>
                        </div>
                        <img src="${profileImage}" alt="avatar"
                          class="rounded-circle d-flex align-self-start ms-3 shadow-1-strong" width="60">
                      </li>`;

        let herMessage =`<li class="d-flex justify-content-between mb-4">
                        
                            <img src="${profileImage}" alt="avatar"
                              class="rounded-circle d-flex align-self-start me-3 shadow-1-strong" width="60">
                            <div class="card w-100">
                              <div class="card-header d-flex justify-content-between p-3">
                                <p class="fw-bold mb-0">${user.username}</p>
                                <p class="text-muted small mb-0"><i class="far fa-clock" style="font-size:16px;"></i> 10 mins ago</p>
                              </div>
                              <div class="card-body">
                                <p class="mb-0">
                                  ${mensaje}
                                </p>
                              </div>
                            </div>
                          
                          </li>`

               
                if(user.username === currentUser.user.username && data.msg.length > 0){
                  chatContainer.append(myMessage);
                }else if(user.username !== currentUser.user.username && data.msg.length > 0){
                  chatContainer.append(herMessage);
                }
  });

socket.on('unread', (data)=>{
  console.log(data);
  
});

async function sendMessageSocket (user, text){

    let friends = document.querySelectorAll('.user-friend');
    let id_receiver;

    friends.forEach(element =>{
      console.log(element.getAttribute('name'));
      if(element.getAttribute('name') === receiver[0]){
        id_receiver = element.id;
      }
      });

      console.log(id_receiver);

      let getKeyCipher = await getKey(id_receiver);

      console.log(getKeyCipher.key);

      let key = getKeyCipher.key;

    const textEncrypted = CryptoJS.AES.encrypt(text, key).toString();

        if(receiver.length === 1){
          socket.emit('enviar mensaje', {
              sender : user,
              receiver : receiver[0],
              message : textEncrypted 
          });
        }else{
          console.log('error al enviar el mensaje');
        }
  }

const getData = async () => {
    console.log('getData() se ha llamado.');
    const response = await fetch(`${window.location.origin}/getCurrentUser`);

    if(response.status === 200){
        const user = await response.json();
        return user;
      }

      return;
    };


const getKey = async (id) => {
      let token = document.querySelector('meta[name="csrf"]').getAttribute('content');
      console.log('getKey() se ha llamado.');
      const response = await fetch(`${window.location.origin}/chat/getKey/${id}`,{
        credentials :'same-origin',
        method : 'POST',
        headers: {
          'X-CSRF-TOKEN': token
        }
      });

          if(response.status === 200){
              const myKey = await response.json();
              return myKey;
            }

        return;
      };

const getMessages = async (id) => {
        let token = document.querySelector('meta[name="csrf"]').getAttribute('content');
        console.log('getData() se ha llamado.');
        const response = await fetch(`${window.location.origin}/chat/responseChat/${id}`,{
          credentials :'same-origin',
          method : 'POST',
          headers: {
            'X-CSRF-TOKEN': token
          }
        });
  
            if(response.status === 200){
                const messages = await response.json();
                return messages;
              }
  
          return;
        };


const connection = async() => {

  const data = await getData();
  
  socket.emit("user_connected", data.user.username);  
    


  let connectDiv= `<div class="pt-1">
 <span class="badge bg-danger float-end"></span>
</div>`

  $(`.${data.user.username}-chat`).append(connectDiv);

  console.log( $(`.${data.user.username}-chat`));
  console.log(`.${data.user.username}-chat`);

};

( async function(){
     await connection();
})();


});
