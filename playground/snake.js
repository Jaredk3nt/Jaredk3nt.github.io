var initialPosition = 13;
function Snake() {
	// un hard code these position values
	this.x = initialPosition * scalar;
	this.y = initialPosition * scalar;
	this.xspeed = 0;
	this.yspeed = 0;
	this.total = 0;
	this.tail = [];

	this.show = function() {
		noStroke();
		for(var i = 0; i < this.tail.length; i++) {
			var opacity = 255 - (5*(this.tail.length - i));
			if(opacity < 50) {
				opacity = 50;
			}
			fill(79, 159, 249, opacity);
			rect(this.tail[i].x, this.tail[i].y, scalar, scalar);
		}
		fill(79, 159, 249, 255);
		rect(this.x, this.y, scalar, scalar);
	}

	this.updateDirection = function(x, y) {
		paused = false;
		// check for valid input to prevent death by hitting the opposite direction
		if ((this.xspeed === 1 && x === -1) || (this.xspeed === -1 && x === 1)) {
			return;
		} else if ((this.yspeed === 1 && y === -1) || (this.yspeed === -1 && y === 1)) {
			return;
		}
		this.xspeed = x;
		this.yspeed = y;
	}

	this.update = function() {
		if (this.total === this.tail.length) {
			for (var i = 0; i < this.tail.length - 1; i++) {
				this.tail[i] = this.tail[i + 1];
			}
		}
		this.tail[this.total - 1] = createVector(this.x, this.y);

		this.x = this.x + this.xspeed * scalar;
    	this.y = this.y + this.yspeed * scalar;
		// if the snake hits a wall kill it
		if( ((this.x === width) || (this.y === height)) ||
			(this.x === -scalar || this.y === -scalar)) {
			this.resetSnake();
		}
	}

	this.eatFood = function(pos) {
		var distance = dist(this.x, this.y, pos.x, pos.y);
		if(distance < 1) {
			this.total++;
			return true;
		} else {
			return false;
		}
	}

	this.death = function() {
		for (var i = 0; i < this.tail.length; i++) {
			var pos = this.tail[i];
			var distance = dist(this.x, this.y, pos.x, pos.y);
			if (distance < 1) {
				console.log(this.x + ' ' + pos.x + ' starting over');
				this.resetSnake();
			}
		}
	}

	this.resetSnake = function() {
		paused = true;
		this.total = 0;
		this.tail = [];
		this.x = initialPosition * scalar;
		this.y = initialPosition * scalar;
		this.xspeed = 0;
		this.yspeed = 0;
	}
}
