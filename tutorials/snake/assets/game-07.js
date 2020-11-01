let canvasName = 'canvas',
    canvas = null,
    ctx = null;
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
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#00ff00';
  ctx.fillRect(x, y, 10, 10);

  ctx.fillStyle = '#ffffff';
  ctx.fillText('FPS: ' + window.fpsCalculator.fps, 10, 10);
}

function actions() {
  x += 2;

  if (x > canvas.width) {
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
  canvas = document.getElementById(canvasName);
  ctx = canvas.getContext('2d');

  run();
}

window.addEventListener('load', init, false);
