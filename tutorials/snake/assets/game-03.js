const GAME_CONTAINER = 'canvas';
const KEY_UP = "ArrowUp",
      KEY_RIGHT = "ArrowRight",
      KEY_DOWN = "ArrowDown",
      KEY_LEFT = "ArrowLeft";
const KEY_ENTER = "Enter";
const MOVING_UP = 0,
      MOVING_RIGHT = 1,
      MOVING_DOWN = 2,
      MOVING_LEFT = 3;

let canvas,
    ctx;
let x = 50,
    y = 50;
let lastPressed = null;
let movingDirection = null;
let pause = true;

function paint(ctx) {
  // Clean the context for drawing the new frame
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, ctx.width, ctx.height);

  // Debug last key pressed
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Last Pressed: ' + lastPressed, 0, 20);

  ctx.fillStyle = '#00ff00';
  ctx.fillRect(x, y, 10, 10);

  // Draw pause caption
  if (pause) {
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSE', ctx.width / 2, ctx.height / 2);
    ctx.textAlign = 'left';
  }
}

function actions() {
  if (!pause) {
    // Check direction
    switch (lastPressed) {
      case KEY_UP: movingDirection = MOVING_UP; break;
      case KEY_RIGHT: movingDirection = MOVING_RIGHT; break;
      case KEY_DOWN: movingDirection = MOVING_DOWN; break;
      case KEY_LEFT: movingDirection = MOVING_LEFT; break;
    }

    // Move rect
    switch (movingDirection) {
      case MOVING_UP: y -= 10; break;
      case MOVING_RIGHT: x += 10; break;
      case MOVING_DOWN: y += 10; break;
      case MOVING_LEFT: x -= 10; break;
    }

    // Out screen management
    if (x < 0) {
      x = canvas.width - 10;
    } else if (x >= canvas.width) {
      x = 0;
    }
    if (y < 0) {
      y = canvas.height - 10;
    } else if (y >= canvas.height) {
      y = 0;
    }
  }

  // Pause/Unpause
  if (lastPressed == KEY_ENTER) {
      pause = !pause;
      lastPressed = null;
  }
}

function repaint() {
  window.requestAnimationFrame(repaint);
  paint(ctx);
}

function run() {
  setTimeout(run, 40);
  actions();
}

function init() {
  canvas = document.getElementById(GAME_CONTAINER);
  ctx = canvas.getContext('2d');
  ctx.width = canvas.width;
  ctx.height = canvas.height;

  run();
  repaint();
}

document.addEventListener('keydown', function (event) {
  lastPressed = event.key;

  if (lastPressed == KEY_UP || lastPressed == KEY_RIGHT ||
      lastPressed == KEY_DOWN || lastPressed == KEY_LEFT)
    event.preventDefault();
}, false);

window.addEventListener('load', init, false);
