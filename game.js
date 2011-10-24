var canvas;
var main_loop;

var field;
var CENTER = [320, 320];
var FIELD_R = 320;
var FIRE_MAX_SIZE = 45;

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

	for (w in waters) {
	    if (this.touching (waters[w])) {
		this.sizet -= 3000.0 / 30;
		waters[w].douse ();

		if (this.sizet <= 0) {
		    for (f in fires) {
			if (fires[f] == this) {
			    fires.splice (f, 1);
			    break;
			}
		    }
		}
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

var waters;
var current_water;
Water.prototype = new Game_Object;
function Water (x, y) {
    Game_Object.call (this, draw_water, 1, x, y, 0, "circle");

    this.width = 3;
}    
Water.prototype.update =
    function () {
	this.shrink (0.5);
    };
Water.prototype.shrink =
    function (amount) {
	this.width -= amount
	if (this.width <= 0) {
	    for (w in waters) {
		if (waters[w] == this) {
		    waters.splice (w, 1);
		    break;
		}
	    }
	}
    };
Water.prototype.grow =
    function () {
	this.width += 3;
	if (this.width > 30) {
	    this.width = 30;
	}
    };
Water.prototype.douse =
    function () {
	this.shrink (3);
    };

function draw_water (ctx, water) {
    if (hypot (CENTER[0] - water.x, CENTER[1] - water.y)
	> FIELD_R - water.w()) {
	return;
    }

    ctx.save ();
    ctx.fillStyle = "rgb(0, 0, 255)";
    ctx.beginPath();
    ctx.arc (0, 0, Math.ceil(water.w()), 0, Math.PI*2, false);
    ctx.fill();
    ctx.restore ();
}

function draw (ctx) {
    ctx.drawImage (field, 0, 0);

    for (f in fires) {
	fires[f].draw (ctx);
    }

    for (w in waters) {
	waters[w].draw (ctx);
    }
}    

function update () {
    draw (canvas.getContext ('2d'));

    for (f in fires) {
	fires[f].update ();
    }

    for (w in waters) {
	waters[w].update ();
    }

    if (current_water != null) {
	current_water.grow ();
    }
}

function mousemove (evt) {
    if (typeof(event.offsetX) == "undefined") {
	event.offsetX = event.pageX - canvas.offsetLeft;
    }
    if (typeof(event.offsetY) == "undefined") {
	event.offsetY = event.pageY - canvas.offsetTop;
    }

    var mouse_x = event.offsetX - 5;
    var mouse_y = event.offsetY - 5;

    current_water = new Water (mouse_x, mouse_y);
    waters.push (current_water);
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

    waters = new Array ();
    current_water = null;
}
$(document).ready (init);
$(document).keydown (key_down);
$(document).mousemove (mousemove);
