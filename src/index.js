// 1.
// Varying line width, stroking each piece of line separately
var canvas = document.getElementById('canvas1');
var ctx;
var paths = [];
var newPath = [];
var lastPoint = {};
var mouseIsDown = false;
var drawWidth = 40;
var scale = 1;

function constrain(val, min, max) {
  if (val < min || isNaN(val)) {
    return min;
  }
  if (val > max || !isFinite(val)) {
    return max;
  }
  return val;
}

function lerp(src, target, amnt) {
  return src + (target-src)*amnt;
}

function pointerEvent(e) { 
  var out = {x:0, y:0};
  if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
    var touch = e.touches[0] || e.changedTouches[0];
    out.x = touch.pageX;
    out.y = touch.pageY;
  } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
    out.x = e.pageX;
    out.y = e.pageY;
  }
  out.x /= scale;
  out.y /= scale;
  return out;
};

function startDraw(e) {
  e.stopPropagation();
  e.preventDefault();
  var pos = pointerEvent(e);
  
  mouseIsDown = true;
  lastPoint = {
    x: pos.x,
    y: pos.y,
    width: drawWidth / scale
  };
  newPath = [lastPoint];
}

function stopDraw(e) {
  e.stopPropagation();
  e.preventDefault();
  moveDraw(e);
  mouseIsDown = false;
  paths.push(newPath);
  newPath = [];
  redraw();
}

function moveDraw(e) {
  e.stopPropagation();
  e.preventDefault();

  if (mouseIsDown) {
    // console.log(e);
    var pos = pointerEvent(e);

    var newPoint = {
      x: pos.x,
      y: pos.y,
      width: drawWidth / scale
    };

    var dx = pos.x - lastPoint.x;
    var dy = pos.y - lastPoint.y;
    var speed = Math.sqrt(dx*dx + dy*dy) / 10.0;
    if (e.type === 'mousemove' && speed < 0.2) {
      return;
    }
    speed = constrain(speed, 1, drawWidth / scale);
    // console.log(speed);
    var widthDelta = (drawWidth / scale / speed) - lastPoint.width;
    widthDelta = constrain(widthDelta * 0.55, -scale, scale);
    // newPoint.width = lerp(lastPoint.width, drawWidth / speed, 0.0125);
    newPoint.width = lastPoint.width + widthDelta;
    newPath.push(newPoint);
    lastPoint = newPoint;
    redraw();
    redrawPath(newPath);

  }
}

document.addEventListener('mousedown', startDraw);
document.addEventListener('touchstart', startDraw);

document.addEventListener('mouseup', stopDraw);
document.addEventListener('touchend', stopDraw);

document.addEventListener('mousemove', moveDraw);
document.addEventListener('touchmove', moveDraw);

function zoom(amount) {
  scale = constrain(scale + (amount * 0.01), 0.1, 10);
  redraw();
  redrawPath(newPath);  
}

document.addEventListener('wheel', function(e) {
   //console.log(e);
  zoom(-e.deltaY);
  e.stopPropagation();
  e.preventDefault();

});

function resize() {
  // console.log('resizing');
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  paths.forEach(function (path) {
    redrawPath(path);
  });

  if (!mouseIsDown) {
    ctx.font = "24px sans-serif";

    ctx.lineWidth = 4;
    ctx.strokeStyle = "white";
    ctx.strokeText("Draw some stuff (mousewheel to zoom)", 10, 30);

    ctx.fillStyle = "black";
    ctx.fillText("Draw some stuff (mousewheel to zoom)", 10, 30);  
  }
}

function redrawPath(path) {    
  var points = [null, null, null, null];

  path.forEach(function (pt) {
    //var width = 0.5 + Math.sin(i / 20.0) * 10;
    // var width = 10 + Math.random() - 0.5;
    var width = pt.width * scale;

    var m = 0;

    points[0] = points[1];
    points[1] = points[2];
    points[2] = {
      X: pt.x * scale,
      Y: pt.y * scale
    };

    if (points[0] == null)
      return;


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
    // ctx.strokeStyle = "rgba(0,0,0,0.8)";
    ctx.moveTo(m + x0, m + y0);
    ctx.quadraticCurveTo(m + p1.X, m + p1.Y, m + x1, m + y1);
    ctx.stroke();
  });
}

console.log('%c  Notes!  ', 'background: #222; color: #bada55; font-size: 2em;');
var notes = [
  '- stroke weight easing isn\'t consistent across scales',
  '- end caps occasionally bork',
  '- side effects of artificially limiting spacing (see previous)'
];
console.log(notes.join('\n'));
resize();
// window.addEventListener('resize', throttle(resize, 1000));
window.addEventListener('resize', resize);


