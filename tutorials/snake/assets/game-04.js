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
let player = null;
let lastPressed = null;
let movingDirection = MOVING_RIGHT;
let pause = true;
let food = null;
let score = 0;
let walls = new Array(),
    gameover = false;

function Rectangle(x, y, color, width, height) {
  this.x = (x == null) ? 0 : x;
  this.y = (y == null) ? 0 : y;
  this.color = (color == null) ? '#ffffff' : color;
  this.width = (width == null) ? 0 : width;
  this.height = (height == null) ? this.width : height;

  this.intersects = function (rect) {
    if (rect == null) {
      window.console.warn('Missing parameters on function intersects');
    } else {
      return (this.x < rect.x + rect.width &&
        this.x + this.width > rect.x &&
        this.y < rect.y + rect.height &&
        this.y + this.height > rect.y);
    }
  };

  this.draw = function (ctx) {
    if (ctx == null) {
      window.console.warn('Missing parameters on function draw');
    } else {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };
}

function random(max) {
  return Math.floor(Math.random() * max);
}

function paint(ctx) {
  // Clean the context for drawing the new frame
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, ctx.width, ctx.height);

  // Draw score
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Score: ' + score, 0, 20);

  // Draw player
  player.draw(ctx);

  // Draw food
  food.draw(ctx);

  // Draw walls
  for (i = 0, l = walls.length; i < l; i += 1) {
    walls[i].draw(ctx);
  }

  // Draw pause or gameover caption
  if (pause) {
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    if (gameover) {
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
    } else {
      ctx.fillText('PAUSE', canvas.width / 2, canvas.height / 2);
    }
    ctx.textAlign = 'left';
  }
}

function actions() {
  if (!pause) {
    // GameOver Reset
    if (gameover) {
      reset();
    }

    // Check direction
    switch (lastPressed) {
      case KEY_UP: movingDirection = MOVING_UP; break;
      case KEY_RIGHT: movingDirection = MOVING_RIGHT; break;
      case KEY_DOWN: movingDirection = MOVING_DOWN; break;
      case KEY_LEFT: movingDirection = MOVING_LEFT; break;
    }

    // Move rect
    switch (movingDirection) {
      case MOVING_UP: player.y -= 10; break;
      case MOVING_RIGHT: player.x += 10; break;
      case MOVING_DOWN: player.y += 10; break;
      case MOVING_LEFT: player.x -= 10; break;
    }

    // Out screen management
    if (player.x < 0) {
      player.x = canvas.width - 10;
    } else if (player.x >= canvas.width) {
      player.x = 0;
    }
    if (player.y < 0) {
      player.y = canvas.height - 10;
    } else if (player.y >= canvas.height) {
      player.y = 0;
    }

    // Food eaten
    if (player.intersects(food)) {
      score += 1; /* also score++ or score = score + 1 */
      food.x = random(canvas.width / 10 - 1) * 10;
      food.y = random(canvas.height / 10 - 1) * 10;
    }
  }

  // Wall intersects
  for (i = 0, l = walls.length; i < l; i += 1) {
    if (food.intersects(walls[i])) {
      food.x = random(canvas.width / 10 - 1) * 10;
      food.y = random(canvas.height / 10 - 1) * 10;
    }

    if (player.intersects(walls[i])) {
      gameover = true;
      pause = true;
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

function reset() {
  score = 0;
  movingDirection = MOVING_RIGHT;
  player.x = 300;
  player.y = 150;
  food.x = random(canvas.width / 10 - 1) * 10;
  food.y = random(canvas.height / 10 - 1) * 10;
  gameover = false;
}

function init() {
  canvas = document.getElementById(GAME_CONTAINER);
  ctx = canvas.getContext('2d');
  ctx.width = canvas.width;
  ctx.height = canvas.height;

  // Create player
  player = new Rectangle(300, 150, '#00ff00', 10);

  // Create initial food
  food = new Rectangle(470, 150, '#ff0000', 10);

  // Create walls
  walls.push(new Rectangle(200, 100, '#999999', 10));
  walls.push(new Rectangle(200, 200, '#999999', 10));
  walls.push(new Rectangle(400, 100, '#999999', 10));
  walls.push(new Rectangle(400, 200, '#999999', 10));

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
