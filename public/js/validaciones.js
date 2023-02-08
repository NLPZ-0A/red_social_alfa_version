//--------------------------------------------------------CAMPOS DE LOGIN--------------------------------------------------------------------------
const emailLog = document.querySelector('#logemail');
const passwordLog = document.querySelector('#logpass');

//---------------------------------------------------------CAMPOS DE REGISTRO---------------------------------------------------------------------------
const nameReg = document.querySelector('#regname');
const usernameReg = document.querySelector('#regusername');
const emailReg = document.querySelector('#regemail');
const passwordReg = document.querySelector('#regpass');

//-------------------------------------------------------PARRAFO DE ADVERTENCIA--------------------------------------------------------------------
const warningsLogin = document.querySelector('#warningsLogin');
const warningsRegister = document.querySelector('#warningsRegister');

//-----------------------------------------------------------BUTTONS------------------------------------------------------------------------------
const submit = document.querySelector('.btn.submit');


submit.addEventListener('click', e =>{
    const nameRegex = /^[a-zA-ZÀ-ÿ]+(?: [a-zA-ZÀ-ÿ]+){0,1}(?: [a-zA-ZÀ-ÿ]+){0,1}$/;
    const userRegex = /^[a-zA-Z0-9_]+[a-zA-Z0-9_-]{0,15}$/;
    const emailRegex =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/; 

    let warnings = '';
    let submitMessage = false;

    if(!validateString(nameReg.value, nameRegex)){
        nameReg.style = 'border: solid red';
        warnings += `El nombre de registro no es valido <br>`;
        submitMessage = true;
    }
    if(!validateString(usernameReg.value, userRegex)){
        usernameReg.style = 'border: solid red';
        warnings += `El nombre de usuario pare el registro no es valido <br>`;
        submitMessage = true;
    }
    if(!validateString(emailReg.value, emailRegex)){
        emailReg.style = 'border: solid red';
        warnings += `El email de registro no es valido <br>`;
        submitMessage = true;
    }
    if(!validateString(passwordReg.value, passRegex)){
        passwordReg.style = 'border: solid red';
        warnings += `La contraseña de registro no es valida <br>`;
        submitMessage = true;
    }

    if(submitMessage){
        warningsRegister.innerHTML = warnings;
    }

});

const validateString = (str, regex) => {
    // Expresión regular que valida que la cadena no contenga caracteres del tipo asignado
    const specialCharRegex = regex;
    
    // Expresión regular que valida que la cadena no tenga espacios en blanco en los extremos
    const trimRegex = /^\S.*\S$/;
    
    return specialCharRegex.test(str) && trimRegex.test(str);
  }
