const GAME_CONTAINER = 'canvas';

let canvas,
    ctx,
    ctx2,
    ctx3;
let x = 50,
    x2 = 50,
    y = 50;

function paint(ctx) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, ctx.width, ctx.height);

  ctx.fillStyle = '#00ff00';
  ctx.fillRect(x, y, 10, 10);
}

function paint2(ctx) {
  if (ctx.clr == 1) {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, ctx.width, ctx.height);
  }

  ctx.fillStyle = '#00ff00';
  ctx.fillRect(x2, y, 10, 10);
}

function actions() {
  x += 2;

  if (x > canvas.width) {
    x = 0;
  }
}

function actions2() {
  x2 += 2;
}

function run() {
  window.requestAnimationFrame(run);
  actions();
  paint(ctx);

  actions2();
  paint2(ctx3);
  paint2(ctx2);
}

function init() {
  canvas = document.getElementById(GAME_CONTAINER);
  ctx = canvas.getContext('2d');
  ctx.width = canvas.width;
  ctx.height = canvas.height;
  ctx2 = document.getElementById("canvas2").getContext('2d');
  ctx2.width = canvas.width;
  ctx2.height = canvas.height;
  ctx3 = document.getElementById("canvas3").getContext('2d');
  ctx3.width = canvas.width;
  ctx3.height = canvas.height;
  ctx3.clr = 1;

  run();
}

window.addEventListener('load', init, false);
