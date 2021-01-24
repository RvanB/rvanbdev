var screen;
var context;
var width = window.innerWidth;
var height = window.innerHeight;
var mouseX;
var mouseY;
var num = 0;
var size = 8;
var red = 0;
var green = 0;
var blue = 0;

function Player(x, y) {
	this.x = x;
	this.y = y;
	this.velX = 0;
	this.velY = 0;
	this.direction = 0;
	this.speed = 3;
}

Player.prototype.render = function() {
	context.fillRect(width/2 - 10, height/2 - 10, 20, 20);
	context.strokeStyle="lime";
	context.lineWidth = size;
	context.beginPath();
	context.moveTo(width/2,height/2);
	context.lineTo(width/2 + 1000*Math.cos(this.direction), height/2 + 1000*Math.sin(this.direction));
	// context.stroke();
}

Player.prototype.update = function() {
	this.x += this.velX;
	this.y += this.velY;
}

// document.addEventListener("mousemove", function(e) {
// 	mouseX = e.clientX;
// 	mouseY = e.clientY;
// 	player.direction = Math.atan2(mouseY - height/2, mouseX - width/2);
// });

document.addEventListener("click", function() {
	// bullets.push(new Bullet(player.x, player.y, player.direction, 3));
});

document.addEventListener("keypress", function(e) {
	keys[e.keyCode] = true;
});

document.addEventListener("keyrelease", function(e) {
	keys[e.keyCode] = false;
});

var bullets = [];

function Bullet(x, y, direction, speed, red, green, blue) {
	this.red = red;
	this.blue = blue;
	this.green = green;
	this.x = x;
	this.y = y;
	this.velX = 0;
	this.velY = 0;
	this.direction = direction;
	this.speed = speed;	
	this.life = 1;
	
}

Bullet.prototype.fade = function() {
	this.life-=0.002;
	this.color = "rgba(" + this.red + ", " + this.green + ", " + this.blue + ", " + this.life + ")";
}

Bullet.prototype.render = function(color) {
	context.strokeStyle = color;
	context.lineWidth = size;
	context.beginPath();
	context.moveTo(this.x + width/2, this.y + height/2);
	context.lineTo(this.x + width/2 + size*Math.cos(this.direction), this.y + height/2 + size*Math.sin(this.direction));
	context.stroke();
}

Bullet.prototype.update = function() {
	this.fade();
	this.velX = this.speed * Math.cos(this.direction);
	this.velY = this.speed * Math.sin(this.direction);
	
	this.x += this.velX;
	this.y += this.velY;
}

function init() {
	player = new Player(0, 0);
}

window.onload = function() {
	init();
	screen = document.getElementById("screen");
	screen.width = width;
	screen.height = height;
	context = screen.getContext("2d");

	setInterval(function() {
		update();
		render();
	}, 1);
}

function update() {
	red = Math.round(128*Math.cos(Math.PI/6*player.direction) + 168);
	green = Math.round(128*Math.cos(Math.PI/6*player.direction+Math.PI*2/3) + 168);
	blue = Math.round(128*Math.cos(Math.PI/6*player.direction+Math.PI*4/3) + 168);
	
	player.direction += Math.PI/1024;

	num = Math.cos(player.direction) * 2;
	
	bullets.push(new Bullet(player.x, player.y, Math.tan(player.direction), num, red, green, blue));
	player.update();
	for (var i = 0; i < bullets.length; i++) {
		var b = bullets[i];
		if (b.life == 0 || b.x + width/2 < 0 || b.x + width/2 > width || b.y + height/2 < 0 || b.y + height/2 > height) {
			bullets.splice(i, 1);
		}
		else {
			bullets[i].update();
		}
	}
}

function render() {
	context.clearRect(0, 0, width, height);
	// player.render();
	for (var i = 0; i < bullets.length; i++) {
		bullets[i].render(bullets[i].color);
	}
}