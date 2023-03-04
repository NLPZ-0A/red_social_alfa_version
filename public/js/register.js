const submitButtonReg = document.querySelector('.sendRegister');

const registerControl = () =>{
        
    let name = document.querySelector('#name').value;
    let username = document.querySelector('#username').value;
    let email =  document.querySelector('#email').value;
    let password = document.querySelector('#password').value;

    let token = document.querySelector('meta[name="csrf"]').getAttribute('content');
    
    
    $('#onload').fadeIn();
    console.log(`name: ${name}, username:${username}, email:${email}, password:${password}`);
    
    $.ajax({
        type: "POST",
        url: "/register",
        data: {  name: name,
                 username:username,
                 email : email,
                 password: password },
                    headers: { 'X-CSRF-TOKEN': token  },
                    success: function (response, status){
                        console.log(status);
                    console.log(response);
                    $('#onload').fadeOut();

                    location.href = '/login';
    
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    document.querySelector('.errorMessage').innerHTML = '';
                    const responseServer = jqXHR.responseJSON;
                    $('#onload').fadeOut();

                  // La solicitud ha fallado o se ha producido un error en el servidor
                  // Muestra el mensaje de error en la consola del navegador
                  document.querySelector('.errorMessage').innerHTML = responseServer.message;
                  console.log(responseServer.message);
                  console.log("Error: " + textStatus + " - " + errorThrown);
                }
        });
    
    };

    submitButtonReg.addEventListener('click', ()=>{
        registerControl();
    });