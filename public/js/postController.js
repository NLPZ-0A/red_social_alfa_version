
let inputPost = document.getElementById("input-container-text");
let overlay = document.querySelector(".overlay");
let popup = document.querySelector(".popup");

let overlayReply = document.querySelector(".overlay.replyPost");
let submitReplyPost = document.querySelector(".btnReply");

let buttonsOfEditEvent = document.querySelector('.post-menu-wrap > .post-menu-button.edit');
let cerrarPopup = document.querySelector("#btn-cerrar-popup"); //|| document.querySelector(".overlay");
let prevImage= document.querySelector("#imagenPrevisualizacion");
let inputImage = document.querySelector('.upload-hide');

let formData = document.querySelector('form.form-post');
let submitButton = document.querySelector('input.btn-submit');

$(document).ready(function(){

    $('div.post-container').on('click', ".post-ico.button-like", function(){
        let id = this.id;
        let type = $("#post-div"+ id + " > .add-post-buttons >.post-ico.button-like").attr("value");
    
        ajaxLoad(id, type);
    });

//------------------------------------------------------LIKE-------------------------------------------------------

function ajaxLoad(id, type){
    
    $('#onload').fadeIn();
    let token = document.querySelector('meta[name="csrf"]').getAttribute('content');
    
    fetch(`/post/${type}/${id}`,{
        credentials :'same-origin',
                headers : {
                   'X-CSRF-TOKEN': token , 
                    'Cache-Control': 'no-cache' 
                },
        method: 'POST',
        })
        .then((response) =>{
            console.log(response.ok);
            if(response.ok){
                $('#onload').fadeOut();
                $("div#post-div" + id).load(location.href+" div#post-div" + id + ">*","");
                console.log(response);
                console.log('recarago');
            }
        }).catch(err)
            {
                $('#onload').fadeOut();
                throw err;
            }
  

    }


//-----------------------------------------------------abrir y cerrar ventana-------------------------------------------------------------------------
$(document).on('click','.edit-post', function() {
        
        let subMenuId = this.getAttribute('data-submenu-id');
        subMenuId = subMenuId.replace(/[^a-zA-Z0-9-_]/g, '_');
        console.log(subMenuId);
        let subMenuPost = document.querySelector(`[data-value-edit='${subMenuId}']`);
        subMenuPost.classList.add('active');

        if(inputPost){
            inputPost.blur();
        }
    
    });

//----------------------------------------------------cerrar-con-overlay--------------------------------------

overlay.addEventListener("click", function(event) {
    // Detiene la propagación del evento hacia los elementos padre
    event.stopPropagation();

    // Si se hizo clic en el modal, no haga nada
    if (event.target.classList[0] !== 'overlay') return;
  
    // De lo contrario, cierra el modal
    overlay.classList.remove('active');
  });

$('body').click( (e)=>{

    
    // Si se hizo clic en el modal, no haga nada
    if (e.target.classList[0] === 'post-menu-wrap' || e.target.classList[0] === 'far') return;
  
    // De lo contrario, cierra el modal
    $('.post-menu-wrap').removeClass('active');

});


//------------------------------------------------cerrar------------------------------------------------------------------------
$(document).on('click','.post-menu-button.close', function() {
       
            let subMenuId = this.getAttribute('data-close-id');
            console.log(subMenuId);
            subMenuId = subMenuId.replace(/[^a-zA-Z0-9-_]/g, '_');
            console.log(subMenuId);
            let subMenuPost = document.querySelector(`[data-value-edit='${subMenuId}']`);
            subMenuPost.classList.remove('active');

            if(inputPost){
                inputPost.blur();
            }
       
    });

//-----------------------------------------------------abrir el formulario de edicion de post--------------------------------------

$(document).on('click','.post-menu-button.edit', function() {
        console.log(this);
        let id = this.getAttribute('data-edit-id');
        const id_pow = id;
        overlay.classList.add('active');
        let subMenuPost = document.querySelector(`[data-value-edit='${id}']`);
        console.log(subMenuPost);
        subMenuPost.classList.remove('active');
        document.querySelector('form.form-post').reset();
        inputImage.files.value = '';
        console.log(`la imagen cargada en upload custom es ${ document.getElementById("upload-custom").value}`);

        $('input.btn-submit').unbind().click( function(e) {
            e.preventDefault();
            submitDataEdit(id_pow);
            overlay.classList.remove('active');
          });
    
    });

//-------------------------------------compartir post-----------------------------------------
$(document).on('click','.post-ico.compartir', function() {
    let id = this.id;
    overlayReply.classList.add('active');
    submitReplyPost.setAttribute("id", id);
});
    


//-----------------------------------------ir a post-------------------------------------------------
$(document).on('click','.mark-reply', function() {
    let id = this.id;
    console.log(id);
   // window.location.href =`${window.location.origin}/post/${id}`;
});

   
//------------------------------------------Cargar image en formulario-----------------------------------------------------------
inputImage.addEventListener("change", ()=>{

    let archivos = inputImage.files;

    if(!archivos || !archivos.length){
        prevImage.src="";
        return;
    }

    let primerArchivo = archivos[0];

    let objectURL = URL.createObjectURL(primerArchivo);

    prevImage.src = objectURL;
});

//---------------------------------------abrir formulario de post desde el input inicial del home----------------------------------------

if(inputPost){
    inputPost.addEventListener('click', ()=>{
        console.log('click');
        overlay.classList.add('active');
        inputPost.blur();
        document.querySelector('form.form-post').reset();
        inputImage.files.value = '';
        console.log(`la imagen cargada en upload custom es ${ document.getElementById("upload-custom").value}`);
    }); 
}

$('input.btn-submit').unbind().click( function(e) {
    e.preventDefault();
    submitData();
    overlay.classList.remove('active');
});


//--------------------------------------cerrar el formulario base-------------------------------------------------------------------
cerrarPopup.addEventListener('click', ()=>{
    overlay.classList.remove('active');
});


$(document).on('click', '.btn-cerrar-popup', ()=>{
    overlayReply.classList.remove('active');
});

//------------------------------------------------envio de post al backend añadir------------------------------------------------------------

let isRequesting= false;
const submitData = ()=>{
   try{
    $('#onload').fadeIn();
    if (isRequesting) return;
    
    let token = document.querySelector('meta[name="csrf"]').getAttribute('content');
    let formData = document.querySelector('form.form-post');
    let data = new FormData(formData);
   console.log(token);
    console.log(data.get('content'));
    console.log(data.get('image'));

    fetch(`/post/addPost`,{
        credentials :'same-origin',
        headers : {
            'X-CSRF-TOKEN': token 
        },
        method: 'POST',
        body: data,

        })
        .then((response) =>{
            console.log(response.ok);
            isRequesting = false;
            if(response.ok){
                return location.reload();
                console.log(response);
                console.log('recargado');
            }
            $('#onload').fadeOut();
        })

    }catch(err){
        isRequesting = false;
        throw err;
    }
};

//-------------------------------------------------envio de post al backend editar--------------------------------------------
let isRequestingEdit = false;
const submitDataEdit = (id) =>{
    try {
        $('#onload').fadeIn();
        if (isRequestingEdit) return;
        isRequestingEdit = true;
        
        let token = document.querySelector('meta[name="csrf"]').getAttribute('content');
        let formData = document.querySelector('form.form-post');
        let data = new FormData(formData);
        data.append('idPost', id);
        console.log(data.get('image'));

        fetch(`/post/editPost/${id}`, {
                credentials :'same-origin',
                headers : {
                    'X-CSRF-TOKEN': token, 
                    'Cache-Control': 'no-cache' 
                },
                method: 'POST',
                cache: 'no-cache',
                body: data,
            })
            .then((response) => {
                console.log(response.ok);
                if (response.ok) {
                    //document.querySelector('form.form-post').reset();
                    //$("div.post-section").load(location.href + " div#post-div" + id + ">*","");
                    $("div#post-div" + id).load(location.href + " div#post-div" + id + ">*","");
                    $('#onload').fadeOut();
                    console.log(response);
                    console.log('recargado');
                }
                isRequestingEdit = false;
            })
            .catch(error => {
                console.error(error);
                $('#onload').fadeOut();
                isRequestingEdit = false;
            });

    }catch (err) {
        throw err;
    }
}

//----------------------------------------------------------------eliminarPost----------------------------------------------

$(document).on('click','.post-menu-button.delete', function() {
    let id = this.getAttribute('data-delete-id');
    deletePost(id);
    overlay.classList.remove('active');
  });


//----------------------------------------------------------------borrarPost----------------------------------------------------------------------
const deletePost = (id) => {
    try {
        let token = document.querySelector('meta[name="csrf"]').getAttribute('content');
        if (isRequestingEdit) return;
        isRequestingEdit = true;
        //console.log(`/post/deletePost/${id}`);
        $('#onload').fadeIn();

        fetch(`/post/deletePost/${id}`, {
                method: 'POST',
                cache: 'no-cache',
                headers: { 'Cache-Control': 'no-cache',
                            'X-CSRF-TOKEN': token  },
            })
            .then((response) => {
                console.log(response.ok);
                if (response.ok) {
                    let postSection = document.querySelector('.post-section');
                    let post = document.querySelector(`#post-div${id}`);
                    postSection.removeChild(post);

                    $('#onload').fadeOut();
                    console.log(post);
                    console.log(response);
                    console.log('recargado');
                }
                isRequestingEdit = false;
            })
            .catch(error => {
                console.error(error);
                $('#onload').fadeOut();
                isRequestingEdit = false;
            });

    } catch (err) {
        isRequestingEdit = false;
        throw err;
    }
}

//----------------------------------------------------------------compartirPost------------------------------------------------------------------------
const submitReplyData = (id, content)=>{
    try{
    $('#onload').fadeIn();
    if (isRequesting) return;
    let token = document.querySelector('meta[name="csrf"]').getAttribute('content');

    console.log(token);
 
     fetch(`/post/replyPost/${id}`,{
         credentials :'same-origin',
         headers : {
             'X-CSRF-TOKEN': token ,
             'Content-Type' : 'application/json'
         },
         method: 'POST',
         body : JSON.stringify({content : content})
         })
         .then((response) =>{
             console.log(response.ok);
             isRequesting = false;
             if(response.ok){
                 return location.reload();
                 console.log(response);
                 console.log('recargado');
             }
             $('#onload').fadeOut();
         })
 
     }catch(err){
         isRequesting = false;
         throw err;
     }
 };

 $(document).on('click', '.btnReply', (e)=>{
    e.preventDefault();
    let content = document.querySelector('.postReplyInput').value;
    let id =  submitReplyPost.id;
    console.log(content);
    console.log(id);
    submitReplyData(id, content)
});

});


