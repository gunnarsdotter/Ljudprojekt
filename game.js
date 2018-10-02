

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
enemies.src = "cat.png"
var xe = canvas.width/3.3;
var ye = canvas.height-181;
var dye = -2;


//Variabel som ska vara beroende av ljudet. 
var dx = 2;
var dy = -2;
var rafID = null;
var f = 0;

//Ritar bilden. 
function flyingballoon() {

	ctx.beginPath();
	ctx.drawImage(imageballoon, x, y, 140, 200);
    ctx.closePath();
}

function renderEnemy() {

	ctx.drawImage(enemies, xe, ye, 120, 120);
	
}

//Uppdaterar bilden. 
function draw() {
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
    flyingballoon();
	renderEnemy();

 
	if(y +dy > canvas.height-180  || y + dy < 1) {
        dy = -dy;
    }
	
	
	//Ljudet kommer in och ballongen ändrar position.  
	if(soundActive){
		f = getFrequency();
		y = 610+1*Math.pow(10,-4)*Math.pow(f, 2) - 0.5064*f + 4*Math.pow(10, -12) ; 
		//y = 610+4*Math.pow(10,-5)*Math.pow(f, 2) - 0.3558*f + 135.71 ; 
		test.innerHTML += " y"+ y; 
        
		if(y > 400) y= 400;
        if(y <0)y = 0;
    }
    
	

	//Fienden
	xe = xe - dx;
	
	
	rafID = window.requestAnimationFrame( draw );


}
//Intervall i hur ofta bilden ska uppdateras. 
//setInterval(draw, 10);

