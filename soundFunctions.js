
//ljudnoder
var audioContext = null;
var mediaStreamSource = null;
var analyser = null;
//arrayer
var dataArray =null;
var frequencyArray = null;
var datafloatArray = null;
//ljudvariabler
var fvalue = 0;
var i= 0;
var size = 2048;
var sampelrate = 44100;
var threshold;
var displayFrequency;
var soundActive = false;
var fchoice;
var game = false;
var test;
function startGame() {
		fchoice = "FFT";
		threshold = 100;
	displayFrequency =document.getElementById("frequency");	
	displayFrequency.style.visibility = "visible";
	document.getElementById("wrapperstart").style.visibility = "hidden";
	document.getElementById("wrapperbutt").style.visibility = "visible";
	document.getElementById("slider1").style.visibility = "visible";
	document.getElementById("Tvalue").style.visibility = "visible";	
	document.getElementById("Tvalue").innerHTML = threshold;
	test = document.getElementById("test");
	game = true;
}
function endGame(){
		game = false;
		stopAudio();
		alert('Du dog');
		displayFrequency.style.visibility = "hidden";
		document.getElementById("wrapperbutt").style.visibility = "hidden";
		document.getElementById("slider1").style.visibility = "hidden";
		document.getElementById("Tvalue").style.visibility = "hidden";	
		
}

var slider = document.getElementById("myRange");
slider.oninput = function() {
	threshold = this.value;
	document.getElementById("Tvalue").innerHTML = threshold;
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
    startGame();
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
		cepstrumArray = new Float32Array(analyser.frequencyBinCount);
		datafloatArray = new Float32Array(analyser.frequencyBinCount);
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
    if(fchoice=="FFT") return getFrequencyFFT();
    else if (fchoice == "autokorrelation") return getFrequencyAuto();
    else if (fchoice == "HPS") return getFrequencyHPS();
    else if (fchoice == "fourier") return getFrequencyFourier();
}
function getFrequencyFFT(){
		analyser.getByteFrequencyData(dataArray);
    fvalue = Math.max.apply( this, dataArray );
    if((fvalue != -Infinity) && (fvalue > threshold)){
        i = dataArray.findIndex(function (element){
            return element == fvalue;
        });}        
    return frequencyArray[i+1];
}

function getFrequencyHPS(){
	analyser.getFloatFrequencyData(datafloatArray);
	test.innerHTML = "HPS";
	var halfArray = downSampel(datafloatArray, 2);
	var thirdArray = downSampel(datafloatArray, 3);
	var fourthArray = downSampel(datafloatArray, 4);
	
	for(var p= 0; p < datafloatArray.length; p++){
		if(p < halfArray.length){dataArray[p] += halfArray[p];}
		if(p < thirdArray.length){dataArray[p] += thirdArray[p];}
		if(p < fourthArray.length){dataArray[p] += fourthArray[p];}
	}
	
	fvalue = Math.max.apply( this, datafloatArray );
  p = datafloatArray.findIndex(function (element){
            return element == fvalue;
        });        
	return  (p+1)*(sampelrate/(datafloatArray.length*2));
}

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
function getFrequencyFourier(){
	analyser.getFloatTimeDomainData(datafloatArray);
	var fourierArray = fouriertransform(datafloatArray);
	var fre = Math.max.apply( this, fourierArray);
	if(fre+100 > threshold){
        i = fourierArray.findIndex(function (element){
            return element == fre;
        });}        
	
		if(i > 900){
			return f;
		}
    return i*(sampelrate/fourierArray.length);
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
function fouriertransform( in_array ) {
		var N = in_array.length;
		var outputArray = [];

		for( var k=0; k < N; k++ ) {
			var real = 0;
			var imag = 0;
			for( var n=0; n < N; n++ ) {
				real += in_array[n]*Math.cos(-2*Math.PI*k*n/N);
				imag += in_array[n]*Math.sin(-2*Math.PI*k*n/N);
			}
			var x = Math.abs(real) + Math.abs(imag);
			outputArray.push(x);
		}
		return outputArray;
}
function downSampel(inArray, number){
	var outputArray = [];
	var i = 0;
	while(i < inArray.length- number){
		var sampel = 0;
		for(var j = 0; j < number; j++){
			sampel += inArray[j+i];
		}
		outputArray.push(sampel/2);
		i += number;
	}
	return outputArray;
}

//Functioner beroende på hur man vill hämta frekvensen
function FFT(){
    fchoice = "FFT";
		document.getElementById("slider1").style.visibility = "visible";
		document.getElementById("Tvalue").style.visibility = "visible";	
}
function autokorrelation(){ 
	fchoice = "autokorrelation";
	document.getElementById("slider1").style.visibility = "hidden";
		document.getElementById("Tvalue").style.visibility = "hidden";	
}
function HPS(){ 
	fchoice ="HPS";
	document.getElementById("slider1").style.visibility = "hidden";
	document.getElementById("Tvalue").style.visibility = "hidden";	
}
function fourier(){ 
		fchoice = "fourier";
		document.getElementById("slider1").style.visibility = "visible";
		document.getElementById("Tvalue").style.visibility = "visible";	
}


//TABORT
/*
function getFrequencyCepstrum(){
	analyser.getFloatTimeDomainData(datafloatArray);
	cepstrumArray = cepstrumfinder(datafloatArray);
	fvalue = Math.max.apply( this, cepstrumArray);
	test.innerHTML += "fvalue " + fvalue;
	if(fvalue > 1){
		return sampelrate/fvalue;
	}else{
		return f;
	}
}

function cepstrumfinder( in_array ) {
		var N = in_array.length;
		var laf = new Array();
		var outputArray = new Array();
		var x = 0;
		for( var k=0; k < N; k++ ) {
			var real = 0;
			var imag = 0;
			for( var n=0; n < N; n++ ) {
				real += in_array[n]*Math.cos(-2*Math.PI*k*n/N);
				imag += in_array[n]*Math.sin(-2*Math.PI*k*n/N);
			}
			x = Math.log(Math.abs(real) + Math.abs(imag));
			laf.push(real);
		}
		for( var m=0; m < N; m++ ) {
			var r = 0;
			var i = 0;
			for( var j = 0; j < N; j++ ) {
					r += laf[m]*Math.cos(2*Math.PI*j*m/N);
					i += laf[m]*Math.sin(2*Math.PI*j*m/N);
			}
			x = r/N;
			outputArray.push(x);
		}
		return outputArray;
}

*/