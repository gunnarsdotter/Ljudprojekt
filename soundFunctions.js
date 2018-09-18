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
    if(audioInput.active){ window.alert("yes");}
    else {window.alert("No");}
}

function nobody() {
    //create audio context
    //create source
    //create effects nodes
    //Finle destenatin
    //connect soours up to effects and the effekt to destination
    
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioCtx = new AudioContext();
    var analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);
    
}