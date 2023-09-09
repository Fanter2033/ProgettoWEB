//Detecting the theme of the device
let LAYOUT_IS_LIGHT = true;
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    LAYOUT_IS_LIGHT = false;
}

//Se il tema del dispositivo cambia, allora occorre aggiornare anche il logo
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',({ matches }) => {
        LAYOUT_IS_LIGHT = !matches;
        updateLogo();
});

function updateLogo() {
    //Hint: more on inline if: https://stackoverflow.com/questions/10270351/how-to-write-an-inline-if-statement-in-javascript
    let src = (LAYOUT_IS_LIGHT ? 'logo.jpeg' : 'logo_negative.jpeg');
    let elements = $('img.logo');
    for(let i = 0; i < elements.length; i++) {
        $(elements[i]).attr('src', `../media/${src}`);
    }
}

//If we have a img.logo element we want show the appropriate logo for the theme device.
$().ready(() => {
    updateLogo();
});