var resolution = 100;
var timesTable = 0;
var interval;
var c;
var ctx;

$(document).ready(function(){
	var screen = document.getElementById("screen");
	screen.width = 800;
	screen.height = 800;

	c = screen;
	ctx = c.getContext("2d");

	interval = setInterval(function(){
		draw();
		timesTable += 0.005;
	}, 15);
});

function draw() {
	ctx.strokeStyle="#888888";
	ctx.clearRect(0, 0, 800, 800);
	var separation = toRadians(360 / resolution);

	for (var i = 0; i < resolution; i++) {
		ctx.beginPath();

		var y = Math.sin(separation * i) * 400 + 400;
		var x = Math.cos(separation * i) * 400 + 400; 
		var y1 = Math.sin(separation * i * timesTable) * 400 + 400;
		var x1 = Math.cos(separation * i * timesTable) * 400 + 400; 
		

		ctx.moveTo(x, y);
		ctx.lineTo(x1, y1);
		ctx.stroke();

	}
}

function toRadians(degrees) {
	return Math.PI / 180 * degrees;
}
