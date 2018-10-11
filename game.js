

//Canvas1
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");


//Variabler för ballong
var x = canvas.width/40;
var y = canvas.height-181;
var imageballoon = new Image();
imageballoon.src = "balloon.png";

//Variabler för fiender
var enemies = new Image();
enemies.src = "cloud.png"
var xe = canvas.width/3.3;
var ye = canvas.height-181;
var dye = -2;


//Variabel som ska vara beroende av ljudet. 
var dx = 8;
var dy = -2;
var rafID = null;
var f = 0;

//Ritar ballongen. 
function flyingballoon() {

	ctx.beginPath();
	ctx.drawImage(imageballoon, x, y, 140, 200);
    ctx.closePath();
}
function renderEnemy() {

	ctx.drawImage(enemies, xe, ye, 120, 120);
	
}
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

//Uppdaterar bilden. 
function draw() {
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
    flyingballoon();
	
	//Kontrollerar ballongens höjd
	if(y +dy > canvas.height-180  || y + dy < 1) {
        dy = -dy;
    }
	
		
	//Kollision
	if(x < xe + 120 && 
		x + 120 > xe && 
		y < ye + 140 &&
		200 + y > ye ) {
		
		//endGame();			
		}
		
	
	
	//Ljudet kommer in och ballongen ändrar position.  
	if(soundActive){
		f = getFrequency();
		displayFrequency.innerHTML = "Frekvensen: " + Math.round(f) + " Hz";
		//y = 610+1*Math.pow(10,-4)*Math.pow(f, 2) - 0.5064*f + 4*Math.pow(10, -12) ; 
		y = 610+4*Math.pow(10,-5)*Math.pow(f, 2) - 0.3558*f - 135.71 ; 
        
		if(y > 400) y= 400;
		if(y < 0) y = 0;
    }
    

	//Fienden
	xe = xe - dx;
	renderEnemy();
	
	if(xe < 0 )
	{
		xe = 2000;
		ye = getRndInteger(250, 600);
	}
	if(game){
		rafID = window.requestAnimationFrame( draw );
	}
}

