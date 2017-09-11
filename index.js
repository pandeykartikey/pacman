var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

function draw_pacman(){
scale_pacman = 1;
ctx.beginPath();
ctx.arc(pacman.x, pacman.y, 50*scale_pacman, 0.25 * Math.PI, 1.25 * Math.PI, false);
ctx.fillStyle = "rgb(255, 255, 0)";
ctx.fill();
ctx.beginPath();
ctx.arc(pacman.x, pacman.y, 50*scale_pacman, 0.75 * Math.PI, 1.75 * Math.PI, false);
ctx.fill();
ctx.beginPath();
ctx.arc(pacman.x, pacman.y - 50*0.5*scale_pacman , 10*scale_pacman, 0, 2 * Math.PI, false);
ctx.fillStyle = "rgb(0, 0, 0)";
ctx.fill();
}
x=0,y=0
var pacman = {
	speed: 256, // movement in pixels per second
	x: 0,
	y: 0
};
var monster = {
	x: 0,
	y: 0
};
var monstersCaught = 0;

var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;	
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		pacman.y -= 30;			
	}
	if (40 in keysDown) { // Player holding down
		pacman.y += 30;			
	}
	if (37 in keysDown) { // Player holding left
		pacman.x -= 30;			
	}
	if (39 in keysDown) { // Player holding right
		pacman.x += 30;			
	}

	// Are they touching?
	if (
		pacman.x <= (monster.x + 32)
		&& monster.x <= (pacman.x + 32)
		&& pacman.y <= (monster.y + 32)
		&& monster.y <= (pacman.y + 32)
	) {
		++monstersCaught;
		//reset();
	}
};
var render = function () {

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = 'green';
	ctx.fillRect(0,0,600,480);
	draw_pacman();
};
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	requestAnimationFrame(main);
};
var then = Date.now();
main();

