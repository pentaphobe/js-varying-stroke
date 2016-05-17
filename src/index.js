// 1.
// Varying line width, stroking each piece of line separately
var canvas = document.getElementById('canvas1');
var ctx;
var points = [null, null, null, null];

var mouseIsDown = false;

document.addEventListener('mousedown', e => {
  mouseIsDown = true;
});
document.addEventListener('mouseup', e => {
  mouseIsDown = false;
});

document.addEventListener('mousemove', e => {
  if (mouseIsDown) {
    console.log(e);
  }
});

function resize() {
  console.log('resizing');
  // canvas.width = document.documentElement.offsetWidth;
  // canvas.height = document.documentElement.offsetHeight;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
 
  ctx = canvas.getContext('2d');
  redraw();
}

function throttle(fn, delay) {
  var handle;
  return function() {
    if (handle) {
      clearTimeout(handle);
    }
    handle = setTimeout(fn, delay);
  };
}

function redraw() {
  for (var i = -1; i < 200; i = i + 1) {
    var width = 0.5 + Math.sin(i / 20.0) * 10;

    var m = 200;


    //var x = Math.cos(i/4) * 180;
    //  var y = Math.sin(i/4) * 140;    
    var x = (Math.random() - 0.5) * 360;
    var y = (Math.random() - 0.5) * 280;
    points[0] = points[1];
    points[1] = points[2];
    points[2] = {
      X: x,
      Y: y
    };

    if (points[0] == null)
      continue;


    var p0 = points[0];
    var p1 = points[1];
    var p2 = points[2];

    var x0 = (p0.X + p1.X) / 2;
    var y0 = (p0.Y + p1.Y) / 2;

    var x1 = (p1.X + p2.X) / 2;
    var y1 = (p1.Y + p2.Y) / 2;

    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = "black";
    ctx.strokeStyle = "rgba(0,0,0,0.5)";
    ctx.moveTo(m + x0, m + y0);
    ctx.quadraticCurveTo(m + p1.X, m + p1.Y, m + x1, m + y1);
    ctx.stroke();
  }  
}

resize();
// window.addEventListener('resize', throttle(resize, 1000));
window.addEventListener('resize', resize);


