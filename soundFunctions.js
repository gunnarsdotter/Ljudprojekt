//ljudnoder
var audioContext = null;
var mediaStreamSource = null;
var analyser = null;
//arrayer
var dataArray =null;
var frequencyArray = null;
//ljudvariabler
var fvalue = 0;
var i= 0;
var size = 2048;
var sampelrate = 44100;
var threshold = 100;
var soundActive = false;
var fchoice = vanlig;

var test; //TABORT
//TABORT!!
function startGame() {
    test = document.getElementById( "test" );
}

//Försöker starta ljudet
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
//Görs om man inte har hittat en ljudkälla
function streamNotFind() {
    alert('Det gick inte att hitta en ljudkälla.');
}
//Görs om man har hittat en ljudkälla
function streamFind(stream) {
    soundActive = true;
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
//Skapar en analys node så man kan få fram frekvenserna
function createFrequencyAnalyser(){
    analyser = audioContext.createAnalyser();
    analyser.fftSize = size;
    //create arrays
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    frequencyArray = new Float32Array(analyser.frequencyBinCount);
    //Create a array with the frequencyintervallt
    for(var i=0; i <= frequencyArray.length; i++){
        frequencyArray[i] = i*sampelrate/(size);
    }
}
//Stänger av ljudkällan
function stopAudio(){
    soundActive = false;
    try{
        audioContext.close();
    }catch (e){
        alert('Ljudkällan är inte äns på!!!');
    }  
}


//Hämtar frekvensen
function getFrequency(){
    if(fchoice==vanlig) return getFrequencyVanligt();
    else if (fchoice == autokorrelation) return getFrequencyAuto();
    else if (fchoice == HPS) return getFrequencyHPS();
    else if (fchoice == cepstrum) return getFrequencyCepstrum();
}
function getFrequencyVanligt(){
    analyser.getByteFrequencyData(dataArray);
    fvalue = Math.max.apply( this, dataArray );
    //TODO skriv om
    if((fvalue != -Infinity) && (fvalue > threshold)){
        i = dataArray.findIndex(function (element){
            return element == fvalue;
        });}    
    test.innerHTML = "Start: " + fvalue +" something"+ i+ "Frequency"+ frequencyArray[i]+ " japp"+ frequencyArray.length +"hej"+ dataArray.length +"de var allt";
    
    return frequencyArray[i];
}
function getFrequencyCepstrum(){getFrequencyVanligt();}
function getFrequencyHPS(){getFrequencyVanligt();}
function getFrequencyAuto(){getFrequencyVanligt();}

//Functioner beroende på hur man vill hämta frekvensen
function vanlig(){
    fchoice = vanlig;
    startAudio();
}
function autokorrelation(){ fchoice = autokorrelation;
    alert("Jag fungerar inte än! Du får köra vanlig");
}
function HPS(){ fchoice =HPS;
    alert("Jag fungerar inte än! Du får köra vanlig");
}
function cepstrum(){ fchoice = cepstrum;
    alert("Jag fungerar inte än! Du får köra vanlig");
}


/* TABORT
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
