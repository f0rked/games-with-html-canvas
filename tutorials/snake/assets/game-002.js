function GamePanel(container) {
  this.element = document.getElementById(container);
  this.ctx = this.element.getContext('2d');
  this.ctx.width = this.element.width;
  this.ctx.height = this.element.height;
  this.x = 50;
  this.y = 50;
  this.running = false;
  this.element.handler = this;
}

GamePanel.prototype.run = function () {
  if (this.running)
    window.requestAnimationFrame(this.run.bind(this));

  this.actions();
  this.paint(this.ctx);
}

function paint_wrong(ctx) {
  ctx.fillStyle = '#00ff00';
  ctx.fillRect(this.x, this.y, 10, 10);
}

function paint(ctx) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, ctx.width, ctx.height);

  ctx.fillStyle = '#00ff00';
  ctx.fillRect(this.x, this.y, 10, 10);
}

function actions_wrong() {
  this.x += 2;
}

function actions() {
  this.x += 2;

  if (this.x > this.element.width) {
    this.x = 0;
  }
}

function runner(entries, observer) {

    entries.forEach((item, i) => {

      if (item.intersectionRatio > 0.5 && item.target.handler) {
        if (!item.target.handler.running) {
          item.target.handler.running = true;
          item.target.handler.run();
        }
      } else if (item.intersectionRatio <= 0.0 && item.target.handler) {
        item.target.handler.running = false;
      }
    });

}

function init() {
  observer = new IntersectionObserver(runner,
                                      {
                                        rootMargin: '0px',
                                        threshold: 0.5
                                      });

  game01 = new GamePanel("canvas01");
  game01.actions = actions_wrong;
  game01.paint = paint_wrong;
  observer.observe(game01.element);
  game02 = new GamePanel("canvas02");
  game02.actions = actions_wrong;
  game02.paint = paint;
  observer.observe(game02.element);

  game03 = new GamePanel("canvas03");
  game03.actions = actions;
  game03.paint = paint;
  observer.observe(game03.element);


}

window.addEventListener('load', init, false);
