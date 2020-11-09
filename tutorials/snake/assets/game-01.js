var GAME_CONTAINER = 'canvas';

var canvas,
    ctx;

function paint(ctx) {
  ctx.strokeStyle = '#f00';
  ctx.strokeRect(170, 150, 200, 120)

  ctx.beginPath();
  ctx.arc(370, 210, 60, Math.PI/2, Math.PI*3/2, true);
  ctx.stroke();

  ctx.fillStyle = '#00ff00';
  ctx.fillRect(171, 151, 198, 118);

  ctx.beginPath();
  ctx.arc(369, 210, 59, Math.PI/2, Math.PI*3/2, true);
  ctx.fill();

  ctx.strokeText('En canvas', ctx.width / 2, 80);

  ctx.font = 'bold 48px serif';
  ctx.textAlign = "center";
  ctx.strokeText('Primer dibujo', ctx.width / 2, 50);
  ctx.fillText('Primer dibujo', ctx.width / 2, 50);
}

function init() {
  canvas = document.getElementById(GAME_CONTAINER);
  ctx = canvas.getContext('2d');
  ctx.width = canvas.width;
  ctx.height = canvas.height;

  paint(ctx);
}

window.addEventListener('load', init, false);
