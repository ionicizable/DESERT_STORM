resources.load([
    'img/plane.png',
    'img/enemy.png',
    'img/bg.jpg',
    'img/missile.png',
    'img/explosion.png',
    'img/enemy2.png',
    'img/gameover.png'
]);
resources.onReady(init);

var previousTime;

function main() {
    var now = Date.now();
    var td = (now - previousTime) / 1000.0;
    ctx.clearRect(0,0,1000,1000);
    bg.renderBg(ctx,td);
    update(td);
    if (score-lastScore>=1000) {
    	health+=1;
    	document.getElementById('health').innerHTML = health;
    	lastScore = score;
    }
    if (gameOver) {
    	ctx.drawImage(resources.get('img/gameover.png'),250,50);
    	document.getElementById("restart").style.color = '#363636';
    }
    previousTime = now;
};

function init() {
	//var audio = new Audio('theme.mp3');
	theme.play();
    char = new Sprite('img/plane.png',[250,100],[115,67],100,[0,0,1,1,1,1,1,1,1,1,2],[114,67]);
    bg = new Sprite('img/bg.jpg',[0,0],[2000,1000],50,[],[2000,1000]);
    previousTime = Date.now();
	var timer = setInterval(main,40);
}

function inputKeys(td) {
	let dir = 0;

    if(input.isDown('RIGHT') || input.isDown('d')) {
    	dir = 3;
        char.pos[0] += char.speed * td;
        if (!input.isDown('LEFT')&&!input.isDown('UP')&&!input.isDown('DOWN')) {
    		char.done = false;
    	}
    }

    if (!input.isDown('RIGHT')&&!input.isDown('LEFT')&&!input.isDown('UP')&&!input.isDown('DOWN')) {
    	char.frameIdx = 0;
    	dir = 3;
    	char.done = false;
    }

    if(input.isDown('LEFT') || input.isDown('a')) {
    	//char.frameIdx = 0;
    	dir = 2;
    	char.pos[0] -= char.speed * td;
    }

    if(input.isDown('DOWN') || input.isDown('s')) {
		dir = 0;
		char.pos[1] += char.speed * td;
    }

    if(input.isDown('UP') || input.isDown('w')) {
    	dir = 1;
    	char.pos[1] -= char.speed * td;
    }

    if (lastDirection != dir) {
    	char.frameIdx = 0;
    }
	char.render(ctx,dir);
    if (input.isDown('SPACE')) {
    	shoot(Date.now(),[char.pos[0]+70,char.pos[1]+char.renderSize[1]/2-10]);
    }
    lastDirection = dir;

}

function update(td){
	if (!gameOver) {
		collision();
		spawn(Date.now());	
	}

	checkHealth();

	for (var i = 0; i < enemies.length; i++) {
    	enemies[i].renderEnemy(ctx,td);
    	enemies[i].update(td);
    }
    for (var i = 0; i < rockets.length; i++) {
    	rockets[i].renderRocket(ctx,td);
    	rockets[i].update(td);
    }
    for (var i = 0; i < explosions.length; i++) {
    	if (!explosions[i].isEnded()) {
			explosions[i].renderExplosion(ctx);
			explosions[i].updateExplosion(td);
    	}
    	else {
    		explosions.splice(i,1);
    		i-=1;
    	}
    }
    if (!gameOver) {
		inputKeys(td);
    	char.update(td);
    }
}

function collision(){
	checkPlayerBounds();
	rocketsCollision();
	playerCollision();
}

function checkHealth(){
	for (var i = 0; i < enemies.length; i++) {
		if (enemies[i].pos[0]+enemies[i].renderSize[0]<=0) {
			enemies.splice(i,1);
			if (!gameOver) {
				health-=1;
			}
			document.getElementById('health').innerHTML = health;
		}
		if (health<=0) {
			gameOver = true;
		}
	}
}

function playerCollision(){
	for (var i = 0; i < enemies.length; i++) {
		let e = [enemies[i].pos[0]+enemies[i].size[0]/2,enemies[i].pos[1]+enemies[i].size[1]/2];
		if (e[0]>char.pos[0] && e[0]<char.pos[0]+char.size[0]*1 &&
			e[1]>char.pos[1] && e[1]<char.pos[1]+char.size[1]*1) {
			let explosion = new Sprite('img/explosion.png',
						[char.pos[0]+char.size[0],char.pos[1]+char.size[1]],
						[93,93],0,[0,1,2,3,4,5,6,7,8],[100,100]
						);
					explosions.push(explosion);
			gameOver = true;

		}
	}
}

function checkPlayerBounds(){
	if (char.pos[0]<0) {char.pos[0] = 0;}
	if (char.pos[1]<0) {char.pos[1] = 0;}
	if (char.pos[0]>1000-char.renderSize[0]) {char.pos[0] = 1000-char.renderSize[0];}
	if (char.pos[1]>500) {char.pos[1] = 500-char.renderSize[0];}
}

function rocketsCollision(){
	if (rockets.length>0) {
		for (var i = 0; i < rockets.length; i++) {
			for (var j = 0; j < enemies.length; j++) {
				let rocketMid = rockets[i].pos[1]+rockets[i].renderSize[1]/2;
				if ((enemies[j].pos[0]<rockets[i].pos[0]&&enemies[j].pos[0]+enemies[j].size[0]>rockets[i].pos[0])&&(enemies[j].pos[1]<=rocketMid)&&(enemies[j].pos[1]+enemies[j].renderSize[1]>=rocketMid)) {
					let explosion = new Sprite('img/explosion.png',
						[rockets[i].pos[0]+rockets[i].renderSize[0],rocketMid],
						[93,93],0,[0,1,2,3,4,5,6,7,8],[100,100]
						);
					if (getRandomInt(0,1)) {
						explosionSound = new Audio("explosion1.mp3");
					}
					else {
						explosionSound = new Audio("explosion2.mp3");
					}
					explosionSound.volume = 0.1;
					explosionSound.play();
					score+=100;
					ammo+=2;
					document.getElementById("score").innerHTML = score;
					document.getElementById("ammo").innerHTML = ammo;
					explosions.push(explosion);
					enemies.splice(j,1);
					rockets.splice(i,1);
					i-=1;
					j-=1;
					break;
				}
			}
		}
	}
}

function spawn(now){
	if (now-lastSpawn>1000) {
		let enemy = new Sprite('img/enemy2.png',[1100,getRandomInt(50,450)],[115,67],getRandomInt(50,100),[0,0,0,0,0,0,1,1,1,2,2,2],[114,67]);
		enemies.push(enemy);
		lastSpawn = now;
	}
}

function shoot(now,pos){
	if (ammo!=0) {
		if (now-lastShot>400) {
			let rocket = new Sprite('img/missile.png',[pos[0],pos[1]],[55,16],500,[0,1,2,3,4,5,4,3,2,1,0],[55,16]);
			rockets.push(rocket);
			var missileSound = new Audio('missile.mp3');
			missileSound.volume = 0.1;
			missileSound.play();
			lastShot = now;
			ammo-=1;
			document.getElementById("ammo").innerHTML = ammo;
		}
	}

}

function restart(){
	if (gameOver) {
		ammo = 5;
		document.getElementById("ammo").innerHTML = ammo;
		lastSpawn = 0;
		health = 5;
		document.getElementById("health").innerHTML = health;
		explosions = [];
		rockets = [];
		enemies = [];
		lastShot = 0;
		lastDirection = 3;
		score = 0;
		document.getElementById("score").innerHTML = score;
		gameOver = false;
		char.pos[0] = 200;
		char.pos[1] = 250;
		document.getElementById("restart").style.color = '#808080';
	}

}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var ammo = 5;

var theme = new Audio('theme.mp3');
theme.volume = 0.8;

var enemies = [];
var lastSpawn = 0;

var health = 5;

var rockets = [];
var lastShot = 0;

var gameOver = false;

var explosions = [];

var lastDirection = 3;

var lastScore = 0;

var score = 0;