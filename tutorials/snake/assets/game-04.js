const KEY_LEFT = "ArrowLeft",
      KEY_UP = "ArrowUp",
      KEY_RIGHT = "ArrowRight",
      KEY_DOWN = "ArrowDown";
const MOVING_UP = 0,
      MOVING_RIGHT = 1,
      MOVING_DOWN = 2,
      MOVING_LEFT = 3;
const KEY_ENTER = "Enter";

let canvasName = 'canvas',
    canvas = null,
    ctx = null;
let player = null;
let food = null;
let lastPressed = null;
let movingDirection = null;
let pause = true;
let score = 0;
let wall = new Array();
let gameover = false;

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

function reset() {
  score = 0;
  movingDirection = null;
  player.x = 40;
  player.y = 40;
  food.x = random(canvas.width / 10 - 1) * 10;
  food.y = random(canvas.height / 10 - 1) * 10;
  gameover = false;
}

function paint(ctx) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw score
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Score: ' + score, 0, 20);

  player.draw(ctx);
  food.draw(ctx);

  // Draw walls
  for (i = 0, l = wall.length; i < l; i += 1) {
    wall[i].draw(ctx);
  }

  // Draw pause or gameover caption
  if (pause) {
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
      case KEY_LEFT: movingDirection = MOVING_LEFT; break;
      case KEY_UP: movingDirection = MOVING_UP; break;
      case KEY_RIGHT: movingDirection = MOVING_RIGHT; break;
      case KEY_DOWN: movingDirection = MOVING_DOWN; break;
    }

    // Move rect
    switch (movingDirection) {
      case MOVING_UP: player.y -= 10; break;
      case MOVING_RIGHT: player.x += 10; break;
      case MOVING_DOWN: player.y += 10; break;
      case MOVING_LEFT: player.x -= 10; break;
    }

    // Out screen
    if (player.x < 0) {
      player.x = canvas.width - 10;
    } else if (player.x > canvas.width) {
      player.x = 0;
    }

    if (player.y < 0) {
      player.y = canvas.height - 10;
    } else if (player.y > canvas.height) {
      player.y = 0;
    }

    // Food eaten
    if (player.intersects(food)) {
      score += 1; /* also score++ or score = score + 1 */
      food.x = random(canvas.width / 10 - 1) * 10;
      food.y = random(canvas.height / 10 - 1) * 10;
    }

    // Wall Intersects
    for (i = 0, l = wall.length; i < l; i += 1) {
      if (food.intersects(wall[i])) {
        food.x = random(canvas.width / 10 - 1) * 10;
        food.y = random(canvas.height / 10 - 1) * 10;
      }

      if (player.intersects(wall[i])) {
        gameover = true;
        pause = true;
      }
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
  setTimeout(run, 50);
  actions();
}

function init() {
  canvas = document.getElementById(canvasName);
  ctx = canvas.getContext('2d');

  // Create player
  player = new Rectangle(300, 150, '#00ff00', 10);

  // Create initial food
  food = new Rectangle(450, 280, '#ff0000', 10);

  // Create walls
  wall.push(new Rectangle(230, 120, '#999999', 10));
  wall.push(new Rectangle(230, 240, '#999999', 10));
  wall.push(new Rectangle(470, 120, '#999999', 10));
  wall.push(new Rectangle(470, 240, '#999999', 10));

  run();
  repaint();
}


document.addEventListener('keydown', function (event) {
  lastPressed = event.key;

  if (lastPressed == KEY_LEFT || lastPressed == KEY_UP || lastPressed == KEY_RIGHT || lastPressed == KEY_DOWN)
    event.preventDefault();
}, false);

window.addEventListener('load', init, false);
