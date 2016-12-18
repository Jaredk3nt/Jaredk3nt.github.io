var canvas;
var snek;
var scalar = 20;
var food;
var firaMono;
var paused = true;

function preload() {
	firaMono = loadFont('fonts/FiraMono.otf');
}

function setup() {
	canvas = createCanvas(540, 540); 	// create game board
	centerCanvas();
	snek = new Snake();
	frameRate(12);
	food = createVector(initialPosition, initialPosition + 5);
	food.mult(scalar);
}

function draw() {
	background(39, 47, 63);
	if(paused) {
		textSize(12);
		textFont(firaMono);
		textAlign(CENTER);
		fill(135, 153, 188);
		text('This is your snake.\nUse the arrow keys to control him.\n Guide him to the food to grow.', width/2, height/2 + (scalar + 5));
	}
	// run all checks on the snake every turn
	if( snek.eatFood(food) ) {
		placeFood();
	}
	snek.death();
	snek.update();
	snek.show();
	// draw food
	noStroke();
	fill(176,103,240);
	rect(food.x, food.y, scalar, scalar);
}

function keyPressed() {
	if (keyCode === UP_ARROW) {
		snek.updateDirection(0, -1);
	} else if (keyCode === DOWN_ARROW) {
		snek.updateDirection(0, 1);
	} else if (keyCode === RIGHT_ARROW) {
		snek.updateDirection(1, 0);
	} else if (keyCode === LEFT_ARROW) {
		snek.updateDirection(-1, 0);
	}
}

function placeFood() {
	var columns = floor(width/scalar) - 2;
	var rows = floor(height/scalar) - 2;

	food = createVector(floor(random(1, columns)), floor(random(1, rows)));
	food.mult(scalar);
}

function centerCanvas() {
	var x = (windowWidth - width) / 2;
  	canvas.position(x);
}

function windowResized() {
  centerCanvas();
}
