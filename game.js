var canvas;
var main_loop;

var field;
var CENTER = [320, 320];
var FIELD_R = 320;
var FIRE_MAX_SIZE = 40;

var FIRE_IMG;

var fires;

Fire.prototype = new Game_Object;
function Fire (x, y) {
    if (typeof (x) == "undefined") {
	return;
    }
    this.sizet = 0;
    this.SPAWN_SIZE = 2;
    Game_Object.call (this, FIRE_IMG, this.growth_func (this.sizet), x, y, 0,
		      "circle");
    this.next_spawn = -1;
}
Fire.prototype.growth_func =
    function (t) {
	var y_shift = 0.5;
	var numerator = 1.5;
	var constant = 1;
	var coefficient = 1;
	var t_coeff = 0.01;
	var t_shift = 20;
	return y_shift + numerator / (constant + coefficient
				      * Math.exp (t_coeff * -t + t_shift));
    };
Fire.prototype.update =
    function () {
	this.sizet += 1000.0 / 30;
	this.sizescale = this.growth_func (this.sizet);
	this.resize (this.sizescale);
	if (this.sizescale >= this.SPAWN_SIZE - 0.01) {
	    if (this.next_spawn == 0) {
		var theta = 2 * Math.PI * Math.random ();
		var lifetime = 20 + 30 * Math.random ();
		fires.push (new Spark (this.x, this.y, theta, lifetime));
	    }
	    this.next_spawn--;
	    if (this.next_spawn < 0) {
		this.next_spawn = Math.floor (150 * Math.random ());
	    }
	}
    };

Spark.prototype = new Fire;
function Spark (startx, starty, theta, lifetime) {
    Game_Object.call (this, FIRE_IMG, this.growth_func (0), startx, starty, 0,
		      "circle");
    this.vel = 5;
    this.theta = theta;
    this.lifetime = lifetime;
}
Spark.prototype.update =
    function () {
	movement = this.try_move (this.vel * Math.cos (this.theta),
				  this.vel * Math.sin (this.theta));
	this.lifetime--;
	if (this.lifetime <= 0 || movement == false) {
	    fires.splice (fires.indexOf (this), 1);
	    fires.push (new Fire (this.x, this.y));
	}
    };
Spark.prototype.pass =
    function () {
	if (hypot (CENTER[0] - this.x, CENTER[1] - this.y)
	    > FIELD_R - FIRE_MAX_SIZE) {
	    return false;
	}
	return true;
    };

function draw (ctx) {
    ctx.drawImage (field, 0, 0);

    for (f in fires) {
	fires[f].draw (ctx);
    }
}    

function update () {
    draw (canvas.getContext ('2d'));

    for (f in fires) {
	fires[f].update ();
    }
}

function key_down (evt) {
    switch (evt.which) {
    case KEY.ESCAPE:
	clearInterval (main_loop);
	break;
    }
}    

function init () {
    canvas = $("#canvas")[0];

    field = new Image ();
    field.src = "field.png";

    fires = new Array ();
    FIRE_IMG = new Image();
    FIRE_IMG.src = "fire.png";
    $(FIRE_IMG).load (function () {
	fires.push (new Fire (CENTER[0], CENTER[1]));
	main_loop = setInterval (update, 1000.0 / 30);
    });
}
$(document).ready (init);
$(document).keydown (key_down);
