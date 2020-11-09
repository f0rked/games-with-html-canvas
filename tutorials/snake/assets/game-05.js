var GAME_CONTAINER = 'canvas';
var KEY_UP = "ArrowUp",
    KEY_RIGHT = "ArrowRight",
    KEY_DOWN = "ArrowDown",
    KEY_LEFT = "ArrowLeft";
var KEY_ENTER = "Enter";
var MOVING_UP = 0,
    MOVING_RIGHT = 1,
    MOVING_DOWN = 2,
    MOVING_LEFT = 3;

var canvas,
    ctx;
var snake = new Array();
var lastPressed = null;
var movingDirection = MOVING_RIGHT;
var pause = true;
var food = null;
var score = 0;
var gameover = false;
var sectImg = new Image(),
    foodImg = new Image();
var eat = new Audio(),
    over = new Audio();

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

  this.draw = function (ctx, bkgImg) {
    if (ctx == null) {
      window.console.warn('Missing parameters on function draw');
    } else {
      if (bkgImg) {
        ctx.drawImage(bkgImg, this.x, this.y)
      } else {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
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

  // Draw snake
  for (i = 0; i < snake.length; i++) {
    snake[i].draw(ctx, sectImg);
  }

  // Draw food
  food.draw(ctx, foodImg);

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

    // Move snake's body
    for (i = snake.length - 1; i > 0; i--) {
      snake[i].x = snake[i - 1].x;
      snake[i].y = snake[i - 1].y;
    }

    // Move snake's head
    switch (movingDirection) {
      case MOVING_UP: snake[0].y -= 10; break;
      case MOVING_RIGHT: snake[0].x += 10; break;
      case MOVING_DOWN: snake[0].y += 10; break;
      case MOVING_LEFT: snake[0].x -= 10; break;
    }

    // Out screen management
    if (snake[0].x < 0) {
      snake[0].x = canvas.width - 10;
    } else if (snake[0].x >= canvas.width) {
      snake[0].x = 0;
    }
    if (snake[0].y < 0) {
      snake[0].y = canvas.height - 10;
    } else if (snake[0].y >= canvas.height) {
      snake[0].y = 0;
    }

    // Body Intersects
    for (i = snake.length - 1; i > 1; i--) {
      if (snake[0].intersects(snake[i])) {
        over.play();
        gameover = true;
        pause = true;
      }
    }

    // Food eaten
    if (snake[0].intersects(food)) {
      eat.play();
      score += 1; /* also score++ or score = score + 1 */
      snake.push(new Rectangle(snake[0].x, snake[0].y, '#00ff00', 10));
      food.x = random(canvas.width / 10 - 1) * 10;
      food.y = random(canvas.height / 10 - 1) * 10;
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
  snake.length = 0;
  snake.push(new Rectangle(300, 150, '#00ff00', 10));
  snake.push(new Rectangle(290, 150, '#00ff00', 10));
  snake.push(new Rectangle(280, 150, '#00ff00', 10));
  food.x = random(canvas.width / 10 - 1) * 10;
  food.y = random(canvas.height / 10 - 1) * 10;
  gameover = false;
}

function init() {
  canvas = document.getElementById(GAME_CONTAINER);
  ctx = canvas.getContext('2d');
  ctx.width = canvas.width;
  ctx.height = canvas.height;

  // Create snake
  snake.push(new Rectangle(300, 150, '#00ff00', 10));
  snake.push(new Rectangle(290, 150, '#00ff00', 10));
  snake.push(new Rectangle(280, 150, '#00ff00', 10));

  // Create initial food
  food = new Rectangle(470, 150, '#ff0000', 10);

  // Load assets
  sectImg.src = "assets/sect.png";
  foodImg.src = "assets/apple.png";
  eat.src = "assets/eat.oga";
  over.src = "assets/over.oga";

  run();
  repaint();
}

document.addEventListener('keydown', function (event) {
  if (lastPressed == KEY_LEFT && event.key == KEY_RIGHT) ;
  else if (lastPressed == KEY_UP && event.key == KEY_DOWN) ;
  else if (lastPressed == KEY_RIGHT && event.key == KEY_LEFT) ;
  else if (lastPressed == KEY_DOWN && event.key == KEY_UP) ;
  else
    lastPressed = event.key;

  if (lastPressed == KEY_UP || lastPressed == KEY_RIGHT ||
      lastPressed == KEY_DOWN || lastPressed == KEY_LEFT)
    event.preventDefault();
}, false);

window.addEventListener('load', init, false);
