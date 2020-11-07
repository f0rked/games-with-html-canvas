const GAME_CONTAINER = 'canvas';

let canvas,
    ctx;
let x = 50,
    y = 50;

function paint(ctx) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, ctx.width, ctx.height);

  ctx.fillStyle = '#00ff00';
  ctx.fillRect(x, y, 10, 10);
}

function actions() {
  x += 2;

  if (x > canvas.width) {
    x = 0;
  }
}

function run() {
  window.requestAnimationFrame(run);
  actions();
  paint(ctx);
}

function init() {
  canvas = document.getElementById(GAME_CONTAINER);
  ctx = canvas.getContext('2d');
  ctx.width = canvas.width;
  ctx.height = canvas.height;

  run();
}

window.addEventListener('load', init, false);
