$(document).ready(()=>{


    $(document).on('click','.comments', function() {
        let id = this.id;
        $('.box-comment._' + id).addClass('active');
    });

    $(document).on('click','.bxs-send', function() {
        let id = this.id;
        let content = $('.comments-input'+ id).val();
        console.log(id);
        console.log('send');
        console.log(content);

        sendComment(id, content);
    });

    $(document).on('click','.buttonLikeComment', function() {
        let postContainer = document.querySelector('.post-container');
        let id = this.dataset.id;
        let id_post = postContainer.getAttribute('name');
        let type = this.id;

       // console.log(this);
       // console.log(type);
       // console.log(id);
       // console.log(id_post);
        sendLikeComment(type, id, id_post);
    });

    $(document).on('click','.responseButton', function() {
        
        let boxComment = document.querySelector('#input-text-comment');
        const posicion = boxComment.getBoundingClientRect();
       // const posicionX = posicion.left + window.pageXOffset;
        const posicionY = posicion.y ; 


        let option = {
            top: posicionY ,
            behavior: 'smooth'
          }

        $('.box-comment').addClass('active');
        document.querySelector('#input-text-comment').value =`@${this.dataset.name}`;

        window.scrollTo(option);

    });

    $(document).on('click','.bxs-edit', function() {
        const id = this.id;
        console.log('apretado');
        console.log(`#comment-menu-${id}`);
        
      $(`#comment-menu-${id}`).addClass('active');

    });

    $(document).on('click','#close-window', function() {
        const id = this.dataset.closeid;

        $(`#comment-menu-${id}`).removeClass('active');
    });

    $(document).on('click','.comment-menu-button.delete', function() {
        const id = this.dataset.deleteid;
        console.log('eliminar');
        const id_post = document.querySelector('.post-container').getAttribute('name');
        $(`#comment-menu-${id}`).removeClass('active');

        deleteComment(id, id_post);

    });

    let isRequesting = false;
    const sendComment = (id, data) => {
        isRequesting = true;
        let content = data;

        $('#onload').fadeIn();
        let token = document.querySelector('meta[name="csrf"]').getAttribute('content');

        fetch(`${window.location.origin}/comments/addComments/${id}`,{
            credentials :'same-origin',
            headers : {
                'Content-Type':'application/json',
                'X-CSRF-TOKEN': token 
            },
            method: 'POST',
            body: JSON.stringify({content : content}),
        })
        .then(response =>{
            isRequesting = false;
            console.log(`response.ok : ${response.ok}/${response}`);

            if(response.ok){
                console.log('mandando correctamente!');
                console.log(`box-comment${id}`);
                document.querySelector(`.comments-input${id}`).value = '';
                document.querySelector(`.box-comment._${id}`).classList.remove('active');

                
                $("div#post-div" + id).load(location.href + " div#post-div" + id + ">*","");
               
                console.log('teminado!');
                }
               
            $('#onload').fadeOut();
        }).catch(err => {
          
            isRequesting = false;
            $('#onload').fadeOut();
        });
        
    };

    const sendLikeComment = (type, id, id_post) =>{
        $('#onload').fadeIn();
        let token = document.querySelector('meta[name="csrf"]').getAttribute('content');

        fetch(`${window.location.origin}/comments/${type}/${id}`,{
            credentials :'same-origin',
            headers : {
                'X-CSRF-TOKEN': token 
            },
            method: 'POST',
        })
        .then(response =>{
            isRequesting = false;
            console.log(`response.ok : ${response.ok}/${response}`);

            if(response.ok){
                $("div#post-div" + id_post).load(location.href + " div#post-div" + id_post + ">*","");
                }
                
            $('#onload').fadeOut();
        }).catch(err => {
            isRequesting = false;
            $('#onload').fadeOut();
        });

    };

    const deleteComment = (id, id_post)=>{
        $('#onload').fadeIn();
        let token = document.querySelector('meta[name="csrf"]').getAttribute('content');

        fetch(`${window.location.origin}/comments/removeComment/${id}`,{
            credentials :'same-origin',
            headers : {
                'X-CSRF-TOKEN': token 
            },
            method: 'POST',
        })
        .then(response =>{
            isRequesting = false;
            console.log(`response.ok : ${response.ok}/${response}`);

            if(response.ok){
                $("div#post-div" + id_post).load(location.href + " div#post-div" + id_post + ">*","");
                }
                
            $('#onload').fadeOut();
        }).catch(err => {
            isRequesting = false;
            $('#onload').fadeOut();
        });
    };

});