let inputPost = document.getElementById("input-container-text");
//let postInput = document.querySelector(".post-input-container");
let overlay = document.querySelector(".overlay");
let popup = document.querySelector(".popup");
let cerrarPopup = document.querySelector("#btn-cerrar-popup");
let prevImage= document.querySelector("#imagenPrevisualizacion");
let inputImage = document.querySelector('.upload-hide');
let submitButton = document.querySelector('input.btn-submit');


inputPost.addEventListener('click', ()=>{
    console.log('click');
    overlay.classList.add('active');
    inputPost.blur();
});


cerrarPopup.addEventListener('click', ()=>{
    overlay.classList.remove('active');
});

inputImage.addEventListener("change", ()=>{

    const archivos = inputImage.files;

    if(!archivos || !archivos.length){
        prevImage.src="";
        return;
    }

    const primerArchivo = archivos[0];

    const objectURL = URL.createObjectURL(primerArchivo);

    prevImage.src = objectURL;
});


const submitData = (e)=>{
    e.preventDefaultU();

    fetch(`/post/editPost/${id}`,{
        method: 'POST',
        })
        .then((response) =>{
            console.log(response.ok);
            if(response.ok){
                $("div#post-div" + id).load(location.href+" div#post-div" + id + ">*","");
                console.log(response);
                console.log('recarago');
            }
        })
};