const buttonsContainer = document.querySelector('.redes-sociales');


buttonsContainer.addEventListener('click', (e) =>{
   
    console.log(e.target.matches('.boton-redes') || e.target.matches('.fa-solid'));
    if(e.target.matches('.boton-redes') || e.target.matches('.fa-solid')){

        if(e.target.dataset.type === 'follow'){
            let type = e.target.dataset.type;
            let username = e.target.dataset.username;

            request(username, type);
        }
        if( e.target.dataset.type === 'unfollow'){
            let type = e.target.dataset.type;
            let username = e.target.dataset.username;
           
            request(username, type);
        }

    }
});

const request = (username, type) => {
    let token = document.querySelector('meta[name="csrf"]').getAttribute('content');
    $('#onload').fadeIn();

    fetch(`/profile/${type}/${username}`,{
        credentials :'same-origin',
        headers :{
                    'X-CSRF-TOKEN': token , 
                    'Cache-Control': 'no-cache' 
                },
        method : 'POST'
    }).then((response) => {
        if(response.ok){
            $('#onload').fadeOut();
            location.reload();
        }
    }).catch(err => {
        $('#onload').fadeOut();
        console.log(err);
    });


};