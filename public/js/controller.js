'use strict'

const inputControl = document.querySelector('.checkbox');
const submitButtonL = document.querySelector('.btn');
const submitButtonR = document.querySelector('.submit');

const loginControl = () =>{
        
    let email =  document.querySelector('#logemail').value;
    let password = document.querySelector('#logpass').value;
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
            console.log(response);
            console.log('recargado');
        }
    }).catch(err)
        {
            $('#onload').fadeOut();
            throw err;
        }
};
        
    

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

const registerControl = () =>{
        
let name = document.querySelector('.logname').value;
let username = document.querySelector('.username').value;
let email =  document.querySelector('.logemail').value;
let password = document.querySelector('.logpass').value;
let token = document.querySelector('meta[name="csrf"]').getAttribute('content');
let checkbox = document.getElementById('.checkbox');

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
                success: function (data, status) {
                console.log(data);
                $('#onload').fadeOut();

                if (checked != checkbox.checked) {
                    checkbox.click();
                  }
            }
    });

};

submitButtonL.addEventListener('click', () => {

    if(!inputControl.checked){
        loginControl();
        console.log('login enviado');
    }

});

submitButtonR.addEventListener('click',() => {

    if(inputControl.checked){
        registerControl();
        console.log('REGISTRO enviado');
    }

});






