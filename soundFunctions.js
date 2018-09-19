//ljudvariabler
var audioContext = null;
var meter = null; //behövs
var canvasContext = null;//tabort
var WIDTH=500;//tabort
var HEIGHT=50;//tabort
var rafID = null; //tabort?
var mediaStreamSource = null;
var value = null;
var analyser = null;
var test;
var maximum = 0;
var fvalue;
var i;

//Canvas1
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//Canvas2
var Canvas2 = document.getElementById("myCanvas2");
var ctx2 = canvas.getContext("2d");
var imageBack = new Image();
var xb = Canvas2.width;
var yb = Canvas2.height;

//Variabler för ballong
var x = canvas.width/9;
var y = canvas.height-181;
var imageballoon = new Image();
imageballoon.src = "balloon.png";

//Variabel som ska vara beroende av ljudet. 
var dx = 2;
var dy = -2;

//Ritar bilden. 
function flyingballoon() {
	ctx.beginPath();
	ctx.drawImage(imageballoon, x, y, 140, 200);
    ctx.closePath();
}
//Ritar bakgrund. HAMNAR OVANFÖR BALLONGJÄVELN
imageBack.onload = function()
	{
		ctx2.drawImage(imageBack, 0, 0, 1920, 720);
	};
imageBack.src = 'cute.gif'; 
function startGame() {
    test = document.getElementById( "test" );
}
var dataArray;
function startAudio() {
    // grab our canvas
	canvasContext = document.getElementById( "myCanvas" ).getContext("2d");
	
    // monkeypatch Web Audio
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
	
    // grab an audio context
    audioContext = new AudioContext({sampleRate: 44100});
    
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
        }, gotStream, didntGetStream);
    } catch (e) {
        alert('getUserMedia gav ett exception :' + e);
    }

}

function didntGetStream() {
    alert('Det gick inte att hitta en ljudkälla.');
}

function gotStream(stream) {
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);
    startGame();
    
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    frequencyArray = new Float32Array(analyser.frequencyBinCount);
    // Create a new volume meter and connect it.
    //value createAudioValue(audioContext);
    for(var i=0; i <= frequencyArray.length; i++){
        frequencyArray[i] = i*44100.0/1024;
    }
    //Set up audio node network
    mediaStreamSource.connect(analyser);
    //analyser.connect(audioContext.destination);
    
    
    // kick off the visual updating
    draw();
}

function draw( time ) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx2.clearRect(0, 0, canvas.width, canvas.height);
	imageBack.onload();
    flyingballoon();

	if(y +dy > canvas.height-180  || y + dy < 1) {
        dy = -dy;
    }
 
    //Ska kopplas till hur ljudet kommer in. 
    y += dy; 

    // check if we're currently clipping
    //if (meter.checkClipping())
      //  canvasContext.fillStyle = "red";
    //else
      //  canvasContext.fillStyle = "green";
    //TAbort?
    
    
    analyser.getByteFrequencyData(dataArray);
    fvalue = Math.max.apply( this, dataArray );
    if(fvalue == -Infinity){ fvalue = 0;}
    i = dataArray.findIndex(function (element){
        return element == fvalue;
    }
                           );
    test.innerHTML = "Start: " + fvalue +" something"+ i;
    dataArray.forEach(function(element){
       test.innerHTML += Math.round(element)+ ", ";});
    
    // draw a bar based on the current volume
    //canvasContext.fillRect(0, 0, meter.volume*WIDTH*1.4, HEIGHT);
    // set up the next visual callback
    rafID = window.requestAnimationFrame( draw );
        
}


//------------------------TABORT UNDER???--------------------------//
function createAudioValue(audioContext,clipLevel,averaging,clipLag) {
	var processor = audioContext.createScriptProcessor(512);
    processor.onaudioprocess = valueAudioProcess;
	processor.clipping = false;
	processor.lastClip = 0;
	processor.volume = 0;
	processor.clipLevel = clipLevel || 0.98;
	processor.averaging = averaging || 0.95;
	processor.clipLag = clipLag || 750;
    
	// this will have no effect, since we don't copy the input to the output,
	// but works around a current Chrome bug.
	processor.connect(audioContext.destination);
    
    try{
	processor.checkClipping =
		function(){
			if (!this.clipping)
				return false;
			if ((this.lastClip + this.clipLag) < window.performance.now())
				this.clipping = false;
			return this.clipping;
		};
    } catch (e) {}
        processor.shutdown =
		function(){
			this.disconnect();
			this.onaudioprocess = null;
		};

	return processor;
}
function valueAudioProcess( event ) {
    
    //var buf = event.inputBuffer.getChannelData(0);
    //var bufLength = buf.length ;
    //analyser.buffer = event.inputBuffer.getChannelData(0);
    analyser.getFloatFrequencyData(dataArray);
    test.innerHTML = "start: "+ maximum ;
    dataArray.forEach(function(element){
        if(element > maximum)
        {maximum = element}
        test.innerHTML += Math.round(element)+ ", ";});
    //var dataArray = new Uint8Array(buf);
    //var bufferLength = ; 
    //var dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    
}
function volumeAudioProcess( event ) {
	var buf = event.inputBuffer.getChannelData(0);
    var bufLength = buf.length;
	var sum = 0;
    var x;

	// Do a root-mean-square on the samples: sum up the squares...
    for (var i=0; i<bufLength; i++) {
    	x = buf[i];
    	if (Math.abs(x)>=this.clipLevel) {
    		this.clipping = true;
    		this.lastClip = window.performance.now();
    	}
    	sum += x * x;
    }

    // ... then take the square root of the sum.
    var rms =  Math.sqrt(sum / bufLength);

    // Now smooth this out with the averaging factor applied
    // to the previous sample - take the max here because we
    // want "fast attack, slow release."
    this.volume = Math.max(rms, this.volume*this.averaging);
}