const GAME_CONTAINER = 'canvas';

let canvas,
    ctxnull;
let x = 50,
    y = 50;

function paint(ctx) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

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

  run();
}

window.addEventListener('load', init, false);
