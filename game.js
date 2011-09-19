var canvas;
var field;

var fires;

function growth_func (t) {
    return 0.5 + .15 / (.1 + .1 * Math.exp (0.0005 * -t + 2.5));
}

Fire.prototype = new Game_Object;
function Fire (x, y) {
    this.sizet = 0;
    Game_Object.call (this, "fire.png", growth_func (this.sizet), x, y, 0,
		      "circle");
}
Fire.prototype.update =
    function () {
	this.sizet += 1000.0 / 30;
	this.resize (growth_func (this.sizet));
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

function init () {
    canvas = $("#canvas")[0];
    field = new Image ();
    field.src = "field.png";

    fires = new Array ();
    fires.push (new Fire (320, 320));

    setInterval (update, 1000.0 / 30);
}
$(document).ready (init);
