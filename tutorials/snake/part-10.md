---
  layout: tutorial
  id: snake
---

## Almacenamiento local

Hay veces que los juegos necesitan guardar información, para permitir que el jugador continúe otro día, listas de puntuaciones,
etc... Los juegos desarrollados con HTML se ejecutan en el navegador y no tienen acceso al sistema de archivos del computador,
pero por fortuna existe un API llamado *"localStorage"* (almacenamiento local) que nos permite almacenar información, sin límite
de tiempo, gestionada por el navegador, esta información sólo estará disponible para páginas con el mismo origen que la que creó
la información. Existe otro API, *"sessionStorage"*, pero este sólo almacena la información durante el tiempo que el usuario esté
en nuestra página y sólo es accesible desde la pestaña/ventana que los creó.

Para nuestro juego vamos a almacenar una lista con las 10 mejores puntuaciones y cual de ellas ha sido la última, también crearemos
una escena que nos mostrará esta información al acabar la partida.

El almacenamiento local es accesible a través del objeto `window.localStorage` que nos ofrece los métodos `setItem`, `getItem`,
`removeItem` y `clear` para gestionar los datos. El único tipo de dato soportado por *"localStorage"* y *"sessionStorage"* es la
cadena de texto, así que habrá que convertir siempre al guardar y recuperar los datos si el dato es de otro tipo.

Comenzamos con el objeto para gestionar la lista de puntuaciones. Tendrá un método que registra la puntuación obtenida y guarda
los datos en el almacenamiento local y dos atributos; el índice de la última puntuación almacenado y la lista de puntuaciones. El
constructor será el encargado de recuperar los datos cuando se instancie el objeto.

``` javascript
class HighScores {
  constructor() {
    this.list = (window.localStorage.getItem("scoreList")) ?
                    window.localStorage.getItem("scoreList").split(",") : [];
    this.last = (window.localStorage.getItem("lastScore")) ?
                    window.localStorage.getItem("lastScore") : "";
  }

  registerScore(score) {
    // Higher scores are in the lower indexes.
    let i = 0;
    while (this.list[i] > score && this.list.length > i)
      i++;

    // Insert new score and delete the lower one if length is exceeded.
    this.list.splice(i, 0, score);
    if (this.list.length > HighScores.MAX_LENGTH)
      this.list.length = HighScores.MAX_LENGTH;

    // Register the score's position.
    if (i <= HighScores.MAX_LENGTH)
      this.last = i;

    window.localStorage.setItem("scoreList", this.list.join(","));
    window.localStorage.setItem("lastScore", this.last);
  }

  static MAX_LENGTH = 10;
}
```

En el método `registerScore`, primero buscamos la posición del vector en la que insertar la nueva puntuación, puntuaciones más
bajas en índices más altos; insertamos en la posición indicada mediante el uso del método `splice`, que modifica el contenido de
un vector, en la posición dada por el primer parámetro, borra los elementos dados por el segundo e inserta los elementos del
tercer y sucesivos parámetros. Si la longitud final del vector excede el máximo de elementos borrramos el último y registramos
la posición si realmente intertamos una nueva puntuación.

Al guardar la lista debemos convertir el vector en una cadena de texto, el método `join` concatena los elementos del vector usando
el separador indicado.

En el constructor, al recuperar la lista de puntuaciones, debemos transformarla usando el método `split` que devuelve un vector
de cadenas de texto resultante de partir la cadena original usando el separador indicado.

Ahora generamos la escena para mostrar la lista de puntuaciones. Creamos una constante con el nombre de la nueva escena y creamos
la clase coreespondiente:

``` javascript
class HighScoresScene extends Scene {
  constructor(game) { super(game, SCENE_HIGH_SCORES); }

  paint(ctx) {
    // Clean canvas
    ctx.fillStyle = '#003300';
    ctx.fillRect(0, 0, this.game.getWidth(), this.game.getHeight());

    // Draw title
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('HIGH SCORES', this.game.getWidth() / 2, 50);

    let hs = this.game.hs;
    for (let i = 0; i < hs.list.length; i++) {
      let line = ((hs.last == i) ? "* " : "") + hs.list[i];
      ctx.fillText(line, this.game.getWidth() / 2, 60 + i * 10);
    }
  }

  actions() {
    // Load next scene
    if (this.game.lastPressed === KEY_ENTER) {
      Scene.ChangeScene(SCENE_GAME);
      this.game.lastPressed = null;
    }
  }
}
```

Para pintar la lista usamos un bucle `for`, si la posición es la correspomndiente a la última puntuación registrada lo marcamos
con un asterisco.

Ya sólo queda modificar el método `actions` de la escena del juego para que cargue la nueva escena en vez de la escena inicial e
invocar al métoddo para registrar las puntuaciones al detectar el final de la partida; también deberemos crear una instancia de
la nueva escena y de la clase `HighScores` en el constructor de `SnakeGame`.

## Código final

<div class="game_example">
  <script type="application/javascript" src="assets/game-10.js"></script>
  <canvas id="canvas" width="600" height="300" style="background:#999">[Canvas not supported by your browser.]</canvas>
</div>
<div>&nbsp;</div>

``` javascript
{% include_relative assets/game-10.js %}
```
