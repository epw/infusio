var canvas;
var main_loop;

var field;

var fires;

Fire.prototype = new Game_Object;
function Fire (x, y) {
    this.sizet = 0;
    Game_Object.call (this, "fire.png", this.growth_func (this.sizet), x, y, 0,
		      "circle");

    this.SPAWN_SIZE = 2;
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
		var r = 100 * Math.random () + this.r();
		var theta = 2 * Math.PI * Math.random ();
		fires.push (new Fire (this.x + r * Math.cos (theta),
				      this.y + r * Math.sin (theta)));
	    }
	    this.next_spawn--;
	    if (this.next_spawn < 0) {
		this.next_spawn = Math.floor (150 * Math.random ());
	    }
	}
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
    fires.push (new Fire (320, 320));

    main_loop = setInterval (update, 1000.0 / 30);
}
$(document).ready (init);
$(document).keydown (key_down);
