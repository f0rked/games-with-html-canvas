---
  layout: tutorial
  id: snake
---

## Escenas

Ahora que ya tenemos un juego con toda su funcionalidad y el código bien estructurado ha llegado el momento de añadirle detalles
que lo hagan más atractivo. En esta sección vamos a ver como añadir *"escenas"*, nuevas pantallas para mostrar contenido
adicional al juego, como los créditos, ayuda,...

Quizá la forma más sencilla de manejar escenas sea usar una variable donde recogemos la escena actual y una serie de condicionales
en las funciones de pintado y gestión de acciones:

``` javascript
const SCENE_WELCOME = 0,
      SCENE_GAME = 1;

let currentScene = SCENE_WELCOME;

...

function actions() {
  if (currentScene == SCENE_WELCOME) {
    // Actions SCENE_WELCOME
    // ...
  } else if (currentScene == SCENE_GAME) {
    // Actions SCENE_GAME
    // ...
  }
}

function paint(ctx) {
  if (currentScene == SCENE_WELCOME) {
    // Paint SCENE_WELCOME
    // ...
  } else if (currentScene == SCENE_GAME) {
    // Paint SCENE_GAME
    // ...
  }
}

```

En cada rama se incluiría el código correspondiente a cada escena y sólo habría que modificar el valor de `currentScene` para
cambiar de escena. Esta aproximación funciona bien si el número de escenas es pequeño y la lógica asociada a cada escena también,
pero cuando aumenta el número de escenas o se incrementa el tamaño del código asociado a cada una de ellas, pronto se vuelve
inmanejable. ¿Que podemos hacer entonces...?

Más objetos... Esta alternativa, aunque es un poco más compleja y difícil de explicar, a la larga es mucho más práctica y no añade
excesiva complejidad.

En primer lugar crearemos una nueva clase base, `Scene`, que define los métodos necesarios para hacer funcionar una escena y los
atributos y métodos estáticos para poder gestionar las escenas de un juego:

``` javascript
class Scene {

  constructor(game, sceneName) {
    this.game = game;
    Scene.Script[sceneName] = this;
  }

  // Initialize the scene variables needed to start the execution
  load() { }

  // Paint the elements of the scene using the provided graphics context
  paint(ctx) { throw new Error("Pending implementation"); }

  // Compute the next state for the game
  actions() { throw new Error("Pending implementation"); }

  // The currently showing scene
  static Current;

  // All the available scenes stored as a dictionary
  static Script = {};

  static ChangeScene(scene) {
    if (Scene.Script[scene]) {
      Scene.Current = scene;
      Scene.Script[scene].load();
    } else
      throw new Error("No scene " + scene + " was found");
  }

  static paint(ctx) {
    if (Scene.Script[Scene.Current])
      Scene.Script[Scene.Current].paint(ctx);
  }

  static actions() {
    if (Scene.Script[Scene.Current])
      Scene.Script[Scene.Current].actions();
  }
}
```

Como verás sólo hemos implementado el constructor y los métodos estáticos, mientras que los métodos de instancia están vacíos o
lanzan una excepción. En programación orientada a objetos esto se llama *"clase abstracta"*, es decir una clase que no se puede
instanciar, su propósito es definir un interfaz que debe ser implementado por las clases que heredan de ella, tan sólo unos pocos
métodos están implementados, a veces, ninguno. El concepto de *"clase abstracta"* no existe en Javascript, así que esto es lo más
parecido.

El constructor recibe como parámetros una instancia del juego y el nombre de la escena, este uĺtimo se usa para registrar la
instancia de la clase que se está creando en el objeto `Script`, donde luego puede ser buscado por el método estático `ChangeScene`
que, a su vez, invoca el método `load` de la escena seleccionada para prepararlo todo para la ejecución. Los métodos estáticos
`paint` y `run` simplemente llaman al método homónimo de la escena actual tras comprobar que existe en el objeto `Script`.

Todas las escenas de nuestro juego deben heredar de la clase `Scene` y proveer una implementación para, al menos, `paint` y `actions`.

Por último debemos cambiar el código de los métodos `repaint` y `run` de la clase `SnakeGame` para que ejecuten los métodos
correspondientes de la escena actual:

``` javascript
    repaint() {
      window.requestAnimationFrame(this.repaint.bind(this));
      Scene.paint(this.ctx);
    }

    run() {
      setTimeout(this.run.bind(this), 40);
      Scene.actions();
    }
```

### Primeras escenas

Ya lo tenemos todo listo, ahora podemos crear las escenas de nuestro juego. En esta sección, y para comenzar, vamos a crear una
escena para el menú principal y otra para el juego.

Primero definimos 2 nuevas constantes con los nombres de nuestras escenas:

``` javascript
const SCENE_MAIN_MENU = "MainMenu",
      SCENE_GAME = "SnakeGame";
```

Una vez añadido el código de nuestra clase `Scene`, entre el código de las clases `Snake` y `SnakeGame`, añadimos a continuación
de aquella el código de nuestras primeras escenas:

``` javascript
class MainMenuScene extends Scene {
  constructor(game) { super(game, SCENE_MAIN_MENU); }

  paint(ctx) {
    // Clean canvas
    ctx.fillStyle = '#003300';
    ctx.fillRect(0, 0, this.game.getWidth(), this.game.getHeight());

    // Draw title
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('SNAKE', this.game.getWidth() / 2, this.game.getHeight() / 2);
    ctx.fillText('Press Enter', this.game.getWidth() / 2, this.game.getHeight() / 2 + 30);
  }

  actions() {
    // Load next scene
    if (SnakeGame.lastKeyPressed === KEY_ENTER) {
      Scene.ChangeScene(SCENE_GAME);
      SnakeGame.lastKeyPressed = null;
    }
  }
}

class GameScene extends Scene {
  constructor(game) {
    super(game, SCENE_GAME);

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

  load() {
    this.score = 0;
    this.movingDirection = MOVING_RIGHT;

    this.snake.reborn(300, 150, this.movingDirection);

    this.food.relocate(this.game.getWidth(), this.game.getHeight());
    this.gameover = false;
  }

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
    ctx.fillRect(0, 0, this.game.getWidth(), this.game.getHeight());

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
            ctx.fillText('GAME OVER', this.game.getWidth() / 2, this.game.getHeight() / 2);
        } else {
            ctx.fillText('PAUSE', this.game.getWidth() / 2, this.game.getHeight() / 2);
        }
        ctx.textAlign = 'left';
    }
  }

  actions() {
    if (!this.isPaused()) {
      // GameOver reset
      if (this.isGameover()) {
        Scene.ChangeScene(SCENE_MAIN_MENU);
      }

      // Check direction
      switch (SnakeGame.lastKeyPressed) {
        case KEY_LEFT: this.movingDirection = MOVING_LEFT; break;
        case KEY_UP: this.movingDirection = MOVING_UP; break;
        case KEY_RIGHT: this.movingDirection = MOVING_RIGHT; break;
        case KEY_DOWN: this.movingDirection = MOVING_DOWN; break;
      }

      // Move snake
      this.snake.move(10, this.movingDirection, this.game.getWidth(), this.game.getHeight());

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
        this.food.relocate(this.game.getWidth(), this.game.getHeight());
      }
    }

    // Pause/Unpause
    if (SnakeGame.lastKeyPressed == KEY_ENTER) {
        this.pause = !this.pause;
        SnakeGame.lastKeyPressed = null;
    }
  }
}
```

La escena del menú principal es muy sencilla: sobreescribe el constructor para invocar al de la clase `Scene` pasándole su nombre,
no tiene método `load`, el método `paint` escribe texto y `actions` cambia a la escena del juego.

La escena del juego es bastante más complicada:

- Su constructor, tras llamar al constructor de la clase `Scene`, incluye todo el código del constructor de `SnakeGame` excepto
los atributos del contenedor, que deben quedarse en esa clase para estar disponibles en todas las escenas.
- Incluye los métodos `isPaused`, `isGameover` y `loadAssets` de `SnakeGame`.
- El método `load` corresponde con el método `reset`, y `paint` y `actions` con sus homónimos de la clase `SnakeGame`.

En ambas clases hay que usar la referencia a la instancia del juego para acceder a las dimensiones del contenedor y a la última
tecla pulsada.

Por ultimo debemos modificar la clase `SnakeGame` para que en su constructor cree los dos nuevos objetos y cambie a la escena inicial.

## Código final

<div class="game_example">
  <script type="application/javascript" src="assets/game-09.js"></script>
  <canvas id="canvas" width="600" height="300" style="background:#999">[Canvas not supported by your browser.]</canvas>
</div>
<div>&nbsp;</div>

``` javascript
{% include_relative assets/game-09.js %}
```
