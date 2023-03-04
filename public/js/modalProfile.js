const overlayProfilePhoto = document.querySelector('.overlay.photo');
const photoButton = document.querySelector('.boton-avatar');
let inputImageProf = document.querySelector('.overlay.photo  .upload-hide');
let closePopup = document.querySelector("#btn-cerrar-popup");
let submitButtonProf = document.querySelector('.overlay.photo  input.btn-submit');
let formImage = document.querySelector('.form-image');

photoButton.addEventListener('click', () => {
    overlayProfilePhoto.classList.add('active');
});

submitButtonProf.addEventListener('click', (e)=>{
    e.preventDefault();
    submitData();
});

closePopup.addEventListener('click', () => {
    overlayProfilePhoto.classList.remove('active');
});

const submitData = () => {
  
    $('#onload').fadeIn();
    let token = document.querySelector('meta[name="csrf"]').getAttribute('content');
    
    let data = new FormData(formImage);

    fetch(`/profile/uploadProfileImage` ,{
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
        .catch(err => {
            console.log(err);
        });

    

};

inputImageProf.addEventListener("change", ()=>{

    const archivos = inputImageProf.files;

    if(!archivos || !archivos.length){
        prevImage.src="";
        return;
    }

    const primerArchivo = archivos[0];

    const objectURL = URL.createObjectURL(primerArchivo);

    prevImage.src = objectURL;
});