var audioInput;

function printHej() {
    window.alert("Hej");
}

function startAudio() {
    try {
        audioInput = navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    } catch (err) {
        window.alert("Det gick inte hitta ljudkällan.");
    }   
}
function stopAudio() {
    
}
function isActiveAudio() {
    window.alert(audioInput.active());
}

function nobody() {
    //create audio context
    //create source
    //create effects nodes
    //Finle destenatin
    //connect soours up to effects and the effekt to destination
}