'use strict'
const submitButton = document.querySelector('.sendLogin');
let warningP = document.querySelector('.errorMessage');
let warnings;
//const submitButtonR = document.querySelector('.submit');

submitButton.addEventListener('click', (e)=>{
    e.preventDefault();
    console.log('click');
    loginControl();
});

const loginControl = () =>{
        
    let email =  document.querySelector('#email').value;
    let password = document.querySelector('#password').value;

    let token = document.querySelector('meta[name="csrf"]').getAttribute('content');
    $('#onload').fadeIn();
    
    console.log('login enviado');
     
    $('#onload').fadeOut();
    fetch('/login',{
        method: 'POST',
        credentials: 'same-origin', 
        headers: {
        'Content-Type':'application/json',
        'X-CSRF-TOKEN': token  // <--- aquí el token
        },
        body:  JSON.stringify({
            email: email.toString(),
            password : password.toString()
        })
    }).then((response) =>{
        console.log(response.ok);
        if(response.ok){
            $('#onload').fadeOut();
            window.location.replace('/home');
        }

        return response.json().then( data =>  [response, data]);
    }).then(([response, data]) =>{
        console.log(data.message);
        console.log(response);
        warnings = `${data.message}</br>`;

        if(warnings){
            warningP.innerHTML = warnings
         }
    }).catch(err)
        {
            $('#onload').fadeOut();
            throw err;
        }
};