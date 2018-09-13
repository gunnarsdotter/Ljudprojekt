var promise;

function printHej() {
    window.alert("Hej");
}

function startAudio() {
    try {
        promise = navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    } catch (err) {
        window.alert("Det gick inte hitta ljudkällan.");
    }   
}
function stopAudio() {
    
}