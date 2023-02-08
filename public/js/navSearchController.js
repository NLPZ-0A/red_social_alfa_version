
const searchInput = document.querySelector('.input-search');
const searchButton = document.querySelector('.button-search');

searchButton.addEventListener('click', () => {
    console.log('evento ejecutado');
    window.location.replace(`${window.location.origin}/profile/${searchInput.value}`);
});