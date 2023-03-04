const sendButton = document.querySelector('.send-button');
const arrowBack = document.querySelector('.arrow-back');
const form = document.querySelector('.profile-form');

form.addEventListener('submit', e => {
    e.preventDefault();
    const newForm = new FormData(form);
    console.log(newForm);

    sendInfo(newForm);

} );

arrowBack.addEventListener('click', e =>{
    history.back();
    return;
});

const sendInfo = data => {

    $('#onload').fadeIn();
    let token = document.querySelector('meta[name="csrf"]').getAttribute('content');
    const dataParse = Object.fromEntries(data.entries())
    console.log(dataParse);


    console.log(data);
    fetch('/profile/addProfile',{
        credentials: 'same-origin', 
        headers: {
            'content-type':'application/json',
            'X-CSRF-TOKEN': token  
        },
        method: 'POST',
        body : JSON.stringify(dataParse)
    }).then((response) => {
        console.log(response);
        if(response.ok){
            console.log(response);
            $("div.config-forms").load(location.href + " div.config-forms" + ">*","");
            $('#onload').fadeOut();
            //location.reload();
        }
        console.log(response);
    }).catch(err => {
        console.log(err);
        $('#onload').fadeOut();
    });
};



