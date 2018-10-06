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
var threshold;
var soundActive = false;
var fchoice;
var test; //TABORT

function startGame() {
    test = document.getElementById( "test" );
		fchoice = "vanlig";
		threshold = 100;
		startAudio();
}
function endGame(){
		stopAudio();
		alert('Du dog');
}

var slider = document.getElementById("myRange");
slider.oninput = function() {
	threshold = this.value;
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
    if(fchoice=="vanlig") return getFrequencyVanligt();
    else if (fchoice == "autokorrelation") return getFrequencyAuto();
    else if (fchoice == "HPS") return getFrequencyHPS();
    else if (fchoice == "cepstrum") return getFrequencyCepstrum();
}
function getFrequencyVanligt(){
		analyser.getByteFrequencyData(dataArray);
    fvalue = Math.max.apply( this, dataArray );
    if((fvalue != -Infinity) && (fvalue > threshold)){
        i = dataArray.findIndex(function (element){
            return element == fvalue;
        });}        
    return frequencyArray[i];
}
function getFrequencyCepstrum(){getFrequencyVanligt();}
function getFrequencyHPS(){getFrequencyVanligt();}
function getFrequencyAuto(){
	analyser.getByteTimeDomainData(dataArray);
	var fauto = autokorrelationFinder();
	if (fauto !== -1 && fauto !== 5512.5) {
				return fauto;
    }
		else{
				return f;
		}
}

//Extra funktioner freqvens
function autokorrelationFinder() {
	// We use Autocorrelation to find the fundamental frequency.
	
	// In order to correlate the signal with itself (hence the name of the algorithm), we will check two points 'k' frames away. 
	// The autocorrelation index will be the average of these products. At the same time, we normalize the values.
	// Source: http://www.phy.mty.edu/~suits/autocorrelation.html
	// Assuming the sample rate is 48000Hz, a 'k' equal to 1000 would correspond to a 48Hz signal (48000/1000 = 48), 
	// while a 'k' equal to 8 would correspond to a 6000Hz one, which is enough to cover most (if not all) 
	// the notes we have in the notes.json file.
	var bestR = 0, bestK = -1;
	for(var k = 8; k <= 1000; k++){
		var sum = 0;
		
		for(var i = 0; i < dataArray.length-k; i++){
			sum += ((dataArray[i] - 128) / 128) * ((dataArray[i + k] - 128) / 128);
		}
		var r = sum / (dataArray.length + k);
	
		if(r > bestR){
			bestR = r;
			bestK = k;
		}
	
		if(r > 0.9) {
			// Let's assume that this is good enough and stop right here
			break;
		}
	}
	if(bestR > 0.0025) {
		// The period (in frames) of the fundamental frequency is 'bestK'. Getting the frequency from there is trivial.
		var fundamentalFreq = sampelrate / bestK;
		return fundamentalFreq;
	}
	else {
		// We haven't found a good correlation
		return -1;
	}
}


//Functioner beroende på hur man vill hämta frekvensen
function vanlig(){
    fchoice = "vanlig";
}
function autokorrelation(){ 
	fchoice = "autokorrelation";
}
function HPS(){ fchoice ="HPS";
    alert("Jag fungerar inte än! Du får köra vanlig");
}
function cepstrum(){ fchoice = "cepstrum";
    alert("Jag fungerar inte än! Du får köra vanlig");
}
