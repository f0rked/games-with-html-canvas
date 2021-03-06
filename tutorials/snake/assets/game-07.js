const GAME_CONTAINER = 'canvas';

let canvas,
    ctx;
let x = 50,
    y = 50;

window.fpsCalculator = {
  lastTime: 0,
  fps: 0,
  frames: 0,
  acumDelta: 0,
  update: function() {
    let now = Date.now(),
        delta = (now - this.lastTime) / 1000;

    if (delta > 1)
      delta = 0;

    this.lastTime = now;
    this.frames++;
    this.acumDelta += delta;

    if (this.acumDelta > 1) {
      this.fps = this.frames;
      this.frames = 0;
      this.acumDelta -= 1;
    }
  }
};

function paint(ctx) {
  // Clean the context for drawing the new frame
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, ctx.width, ctx.height);

  ctx.fillStyle = '#00ff00';
  ctx.fillRect(x, y, 10, 10);

  ctx.fillStyle = '#ffffff';
  ctx.fillText('FPS: ' + window.fpsCalculator.fps, 10, 10);
}

function actions() {
  x += 2;

  if (x >= canvas.width) {
    x = 0;
  }
}

function run() {
  window.requestAnimationFrame(run);
  window.fpsCalculator.update();
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
