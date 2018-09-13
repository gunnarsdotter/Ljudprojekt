

//Variabler för rörliga objekt
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var imageBack = new Image();

//Variabler för ballong
var x = canvas.width/9;
var y = canvas.height-181;
var imageballoon = new Image();
imageballoon.src = "balloon.png";

//Variabel som ska vara beroende av ljudet. 
var dx = 2;
var dy = -2;

//Ritar bakgrund. HAMNAR OVANFÖR BALLONGJÄVELN
	imageBack.onload = function()
	{
		ctx.drawImage(imageBack, 69, 50);
	};
//	imageBack.src = 'https://www.html5canvastutorials.com/demos/assets/darth-vader.jpg';
	



//Ritar bilden. 
function flyingballoon() {
	

	ctx.beginPath();
	ctx.drawImage(imageballoon, x, y, 140, 200);
    ctx.closePath();


}

//Uppdaterar bilden. 
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    flyingballoon();
	
	if(y +dy > canvas.height-180  || y + dy < 1) {
        dy = -dy;
    }
 
 //Ska kopplas till hur ljudet kommer in. 
   y += dy;
}
//Intervall i hur ofta bilden ska uppdateras. 
setInterval(draw, 10);