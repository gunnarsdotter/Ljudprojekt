<<<<<<< HEAD
var audioInput;
=======
var promise;
>>>>>>> origin/master

function printHej() {
    window.alert("Hej");
}

function startAudio() {
    try {
<<<<<<< HEAD
        audioInput = navigator.mediaDevices.getUserMedia({ audio: true, video: false });
=======
        promise = navigator.mediaDevices.getUserMedia({ audio: true, video: false });
>>>>>>> origin/master
    } catch (err) {
        window.alert("Det gick inte hitta ljudkällan.");
    }   
}
function stopAudio() {
<<<<<<< HEAD
    
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
=======
>>>>>>> origin/master
    
}