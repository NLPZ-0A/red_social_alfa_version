$(document).ready(function() {

    if(location.href.includes('myAccount')){
        document.querySelector('.my-account').classList.add('active');
        //$('.tables').addClass('active');
    }
    if(location.href.includes('editprofile')){
        console.log('editProfile');
        document.querySelector('.edit-profile').classList.add('active');
       // $('.user').addClass('active');
    }
    if(location.href.includes('testing')){
        //$('.testing').addClass('active');
    }
    if(location.href.includes('dashboard')){
       // $('.dashboard').addClass('active');
    }
    if(location.href.includes('home')){
        //$('.home').addClass('active');
    }

});