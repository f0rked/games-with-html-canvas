let canvasName = 'canvas',
    canvas = null,
    ctx = null;

function paint(ctx) {
  ctx.strokeStyle = '#f00';
  ctx.strokeRect(50, 50, 100, 60)

  ctx.fillStyle = '#00ff00';
  ctx.fillRect(51, 51, 98, 58);
}

function init() {
  canvas = document.getElementById(canvasName);
  ctx = canvas.getContext('2d');
  paint(ctx);
}

window.addEventListener('load', init, false);
