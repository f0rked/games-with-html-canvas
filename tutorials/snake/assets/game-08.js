/*jshint esversion: 5*/
(function (window, document, undefined) {
  "use strict";

  const GAME_CONTAINER = "canvas",
        KEY_LEFT = "ArrowLeft",
        KEY_UP = "ArrowUp",
        KEY_RIGHT = "ArrowRight",
        KEY_DOWN = "ArrowDown",
        MOVING_UP = 0,
        MOVING_RIGHT = 1,
        MOVING_DOWN = 2,
        MOVING_LEFT = 3,
        KEY_ENTER = "Enter";
  const ASSET_SNAKE_SECTION = "assets/sect.png",
        ASSET_FOOD = "assets/apple.png",
        ASSET_EAT = ["assets/eat.oga", "assets/eat.m4a"],
        ASSET_OVER = ["assets/over.oga", "assets/over.m4a"];

  class Rectangle {
    constructor(x, y, color, width, height) {
      this.x = (x == null) ? 0 : x;
      this.y = (y == null) ? 0 : y;
      this.color = (color == null) ? '#ffffff' : color;
      this.width = (width == null) ? 0 : width;
      this.height = (height == null) ? this.width : height;
    }

    intersects(rect) {
      if (rect == null) {
        window.console.warn('Missing parameters on function intersects');
      } else {
        return (this.x < rect.x + rect.width &&
          this.x + this.width > rect.x &&
          this.y < rect.y + rect.height &&
          this.y + this.height > rect.y);
      }
    }

    draw(ctx) {
      if (ctx == null) {
        window.console.warn('Missing parameters on function draw');
      } else {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    }
  }

  class SpriteRectangle extends Rectangle {
    constructor(x, y, color, image, width, height) {
      super(x, y, color, width, height);
      this.bkgImg = image
    }

    draw(ctx) {
      if (ctx != null) {
        if (this.bkgImg != null && this.bkgImg.width > 0)
          ctx.drawImage(this.bkgImg, this.x, this.y)
        else
          super.draw(ctx)
      }
    }
  }

  class Food extends SpriteRectangle {
    relocate(maxWidth, maxHeight) {
      this.x = SnakeGame.random(maxWidth / this.width - 1) * this.width;
      this.y = SnakeGame.random(maxHeight / this.height - 1) * this.height;
    }
  }

  class Snake {
    constructor(x, y, direction, width, height, color, sprite) {
      this.width = (width) ? width : 10;
      this.height = (height) ? height : 10;
      this.color = (color) ? color : "#00ff00";
      this.headSprite = this.bodySprite = sprite;
      this.body = [];

      this.reborn(x, y, direction)
    }

    reborn(x, y, direction) {
      this.body.length = 0;

      for (let i = 0; i < 3; i++) {
        this.body.push(new SpriteRectangle(x, y, this.color, this.headSprite, this.width, this.height));
        if (direction == MOVING_UP)
          y -= this.height;
        else if (direction == MOVING_DOWN)
          y += this.height;
        else if (direction == MOVING_LEFT)
          x += this.width;
        else if (direction == MOVING_RIGHT)
          x -= this.width;
      }
    }

    draw(ctx) {
      for (let i = 0; i < this.body.length; i++) {
        this.body[i].draw(ctx);
      }
    }

    move(howMuch, direction, maxWidth, maxHeight) {
      // Move snake's body
      if (direction != null) {
        for (let i = this.body.length - 1; i > 0; i--) {
          this.body[i].x = this.body[i - 1].x;
          this.body[i].y = this.body[i - 1].y;
        }
      }

      // Move snake's head
      switch (direction) {
        case MOVING_UP: this.body[0].y -= howMuch; break;
        case MOVING_RIGHT: this.body[0].x += howMuch; break;
        case MOVING_DOWN: this.body[0].y += howMuch; break;
        case MOVING_LEFT: this.body[0].x -= howMuch; break;
      }

      // Out screen
      if (this.body[0].x < 0) {
        this.body[0].x = maxWidth - howMuch;
      } else if (this.body[0].x > maxWidth) {
        this.body[0].x = 0;
      }

      if (this.body[0].y < 0) {
        this.body[0].y = maxHeight - howMuch;
      } else if (this.body[0].y > maxHeight) {
        this.body[0].y = 0;
      }
    }

    hasEaten(food) {
      if (this.body[0].intersects(food)) {
        this.body.push(new SpriteRectangle(0, 0, this.color, this.headSprite, this.width, this.height));
        return true;
      }
      return false;
    }

    hasBitten() {
      for (let i = this.body.length - 1; i > 1; i--) {
        if (this.body[0].intersects(this.body[i])) {
          return true;
        }
      }

    }
  }

  class SnakeGame {

    constructor(canvas) {

      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.lastPressed = null;
      this.movingDirection = MOVING_RIGHT;
      this.pause = true;
      this.score = 0;
      this.gameover = false;

      // Load assets
      this.loadAssets();

      // Create snake
      this.snake = new Snake(300, 150, MOVING_RIGHT, 10, 10, '#00ff00', this.sectImg);

      // Create initial food
      this.food = new Food(450, 280, '#ff0000', this.foodImg, 10);
    }

    getWidth() { return this.canvas.width; }

    getHeight() { return this.canvas.height; }

    isPaused() { return this.pause ; }

    isGameover() { return this.gameover ; }

    loadAssets() {
      let audioFormat = ((new Audio()).canPlayType('audio/ogg') != '') ? 0 : 1;

      this.sectImg = new Image();
      this.foodImg = new Image();
      this.sectImg.src = ASSET_SNAKE_SECTION;
      this.foodImg.src = ASSET_FOOD;

      this.eat = new Audio(ASSET_EAT[audioFormat]);
      this.over = new Audio(ASSET_OVER[audioFormat]);
    }

    paint(ctx) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, this.getWidth(), this.getHeight());

      // Draw score
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Score: ' + this.score, 0, 20);

      // Draw snake
      this.snake.draw(ctx);

      this.food.draw(ctx);

      // Draw pause or gameover caption
      if (this.isPaused()) {
          ctx.textAlign = 'center';
          if (this.isGameover()) {
              ctx.fillText('GAME OVER', this.getWidth() / 2, this.getHeight() / 2);
          } else {
              ctx.fillText('PAUSE', this.getWidth() / 2, this.getHeight() / 2);
          }
          ctx.textAlign = 'left';
      }
    }

    actions() {
      if (!this.isPaused()) {
        // GameOver reset
        if (this.isGameover()) {
          this.reset();
        }

        // Check direction
        switch (this.lastPressed) {
          case KEY_LEFT: this.movingDirection = MOVING_LEFT; break;
          case KEY_UP: this.movingDirection = MOVING_UP; break;
          case KEY_RIGHT: this.movingDirection = MOVING_RIGHT; break;
          case KEY_DOWN: this.movingDirection = MOVING_DOWN; break;
        }

        // Move snake
        this.snake.move(10, this.movingDirection, this.getWidth(), this.getHeight());

        // Body Intersects
        if (this.snake.hasBitten()) {
            this.over.play();
            this.gameover = true;
            this.pause = true;
        }

        // Food eaten
        if (this.snake.hasEaten(this.food)) {
          this.eat.play();
          this.score += 1; // also score++ or score = score + 1
          this.food.relocate(this.getWidth(), this.getHeight());
        }
      }

      // Pause/Unpause
      if (this.lastPressed == KEY_ENTER) {
          this.pause = !this.pause;
          this.lastPressed = null;
      }
    }

    reset() {
      this.score = 0;
      this.movingDirection = MOVING_RIGHT;

      this.snake.reborn(300, 150, this.movingDirection);

      this.food.relocate(this.getWidth(), this.getHeight());
      this.gameover = false;
    }

    repaint() {
      window.requestAnimationFrame(this.repaint.bind(this));
      this.paint(this.ctx);
    }

    run() {
      setTimeout(this.run.bind(this), 50);
      this.actions();
    }

    keyHandler() {
      if (this.lastPressed == KEY_LEFT && event.key == KEY_RIGHT) ;
      else if (this.lastPressed == KEY_UP && event.key == KEY_DOWN) ;
      else if (this.lastPressed == KEY_RIGHT && event.key == KEY_LEFT) ;
      else if (this.lastPressed == KEY_DOWN && event.key == KEY_UP) ;
      else
        this.lastPressed = event.key;

      if (this.lastPressed == KEY_LEFT || this.lastPressed == KEY_UP || this.lastPressed == KEY_RIGHT || this.lastPressed == KEY_DOWN)
        event.preventDefault();
    }

    static initialize() {

      window.snakeGame = new SnakeGame(document.getElementById(GAME_CONTAINER));

      window.addEventListener("keydown", window.snakeGame.keyHandler.bind(window.snakeGame), false);

      window.snakeGame.run();
      window.snakeGame.repaint();
    }

    static random(max) {
      return Math.floor(Math.random() * max);
    }
  }

  window.addEventListener("load", SnakeGame.initialize, false);
}(window, document));
