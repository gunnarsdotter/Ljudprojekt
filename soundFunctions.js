//ljudvariabler
var audioContext = null;
var mediaStreamSource = null;
var analyser = null;
var fvalue = 0;
var i= 0;
var dataArray =null;
var frequencyArray = null;
var size = 1024;
var sampelrate = 44100;
var test; //tabort

function startGame() {
    test = document.getElementById( "test" );
}

function startAudio() {	
    // monkeypatch Web Audio
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
	
    // grab an audio context
    audioContext = new AudioContext({sampleRate: sampelrate});
    
    // Attempt to get audio input
    try {
        // monkeypatch getUserMedia
        navigator.getUserMedia = 
        	navigator.getUserMedia ||
        	navigator.webkitGetUserMedia ||
        	navigator.mozGetUserMedia;

        // ask for an audio input
        navigator.getUserMedia(
        {
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        }, streamFind, streamNotFind);
    } catch (e) {
        alert('getUserMedia gav ett exception :' + e);
    }
}

function streamNotFind() {
    alert('Det gick inte att hitta en ljudkälla.');
}
function createFrequencyAnalyser(){
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024;
    //create arrays
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    frequencyArray = new Float32Array(analyser.frequencyBinCount);
    //Create a array with the frequencyintervallt
    for(var i=0; i <= frequencyArray.length; i++){
        frequencyArray[i] = i*sampelrate/size;
    }
}
function streamFind(stream) {
    startGame();
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);
    //Create an analyser 
    createFrequencyAnalyser();
    //Set up audio node network
    mediaStreamSource.connect(analyser);
    //analyser.connect(audioContext.destination); //if this is active then the sound will go to the speakers.
    
    // kick off the visual updating
    draw();
}

function getFrequency(){
    analyser.getByteFrequencyData(dataArray);
    fvalue = Math.max.apply( this, dataArray );
    //TODO skriv om
    if((fvalue != -Infinity) || (fvalue > 100)){
        i = dataArray.findIndex(function (element){
            return element == fvalue;
        });}    
    return frequencyArray[i];
}
/*
function draw( time ) {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx2.clearRect(0, 0, canvas.width, canvas.height);
	imageBack.onload();
    
    
   test.innerHTML = "Start: " + fvalue +" something"+ i+ "Frequency"+ frequencyArray[i]+ " japp de var allt";
    frequencyArray.forEach(function(element){
       test.innerHTML += Math.round(element)+ ", ";});
    
    if (frequencyArray[i] >200 && frequencyArray[i] < 400){y = }
    else if(frequencyArray[i] >400 && frequencyArray[i] < 600){y = }
    else if(frequencyArray[i] >600 && frequencyArray[i] < 800) {y =}
    else if(frequencyArray[i] >800 && frequencyArray[i] < 1000){y = }
    else if(frequencyArray[i] >1000 && frequencyArray[i] < 1200) {y =}
    else if(frequencyArray[i] >1200 && frequencyArray[i] < 1500) {y =}
    else if(frequencyArray[i] > 15000){y = }
    else if(frequencyArray[i] < 200) {y = }
                                       
    //Ska kopplas till hur ljudet kommer in. 
    y = getFrequency();

    // set up the next visual callback
    rafID = window.requestAnimationFrame( draw );
        
}*/
