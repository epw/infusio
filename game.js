var canvas;
var field;

var fires;

Fire.prototype = new Game_Object;
function Fire (x, y) {
    Game_Object.call (this, "fire.png", 1, x, y, 0, "circle");
}

function draw (ctx) {
    ctx.drawImage (field, 0, 0);

    for (f in fires) {
	fires[f].draw (ctx);
    }
}    

function update () {
    draw (canvas.getContext ('2d'));

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
