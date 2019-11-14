import Hero from 'Hero.js';

var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

const gameWidth=1000;
const gameHeight=300;

var hero = new Hero(gameWidth,gameHeight);
hero.draw(ctx); 


/*function updateFrame(){
	currentFrame = ++currentFrame % cols;
	srcX = currentFrame * width;
}
var posx=0;
function drawImage(){
	ctx.clearRect(0,0,64,64);
	ctx.drawImage(bg, 0, -440);

	updateFrame();
	ctx.drawImage(char, srcX, srcY, 64, 64, posx, 0, 64, 64);
	
	posx++;
}
setInterval(function(){
	drawImage();
},100);*/
