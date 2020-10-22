---
  layout: tutorial
  id: snake
---

# Interactuando con otros elementos

Ya permitimos que el jugador interaccione con el juego, pero otro punto importante es que los distintos elementos del juego puedan
interactuar entre sí. Las interacciones entre elementos del juego suelen ser, principalmente, contactos entre ellos. Para saber si
se está dando esta condición necesitamos saber las coordenadas y las dimensiones de ambos elementos.

En Javascript las funciones, además de agrupar código para ser llamado posteriormente usando su nombre, también nos permiten crear
objetos (definiendo lo que en otros lenguajes se llama *clase*). A continuación vamos a crear on objeto `Rectangle` que contendrá
los datos de coordenadas, el color y sus dimensiones. Aparte de *atributos* (que es cómo se llaman las variables dentro de un
objeto) también pueden contener *métodos* (denominación para las funciones dentro de un objeto). Para saber más sobre este tema
consulta [Programación orientada a objetos](part-08.html){:target="\_blank"} o la sección de referencias.

En nuestro caso le dotaremos de los métodos:

- `doIntersect` - Calcula si el objeto está en intersección con otro que se le pasa como argumento.
{% comment %} - `move`. Calcula la nueva posición del objeto en función de la dirección que se le pasa como argumento.{% endcomment %}
- `draw` - Dibuja el objeto dentro del contexto que se le pasa como argumento.

Copia el siguiente código al principio del fichero de código, después de la sección de definición de constantes y variables:

``` javascript
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
{% comment %}

  this.move = function (direction) {
    switch (direction) {
      case MOVING_UP: this.y -= 10; break;
      case MOVING_RIGHT: this.x += 10; break;
      case MOVING_DOWN: this.y += 10; break;
      case MOVING_LEFT: this.x -= 10; break;
    }
  }

{% endcomment %}
  this.draw = function (ctx) {
    if (ctx == null) {
      window.console.warn('Missing parameters on function draw');
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };
}
```

La función `Rectangle` tiene como parámetros los datos necesarios para construir el objeto (coordenadas, color y dimensiones),
el primer bloque de código de la función asigna valores por defecto para los datos que no lleguen. Si no indicamos nada se creará
un objeto con coordenadas x = 0, y = 0, de color blanco (#ffffff) y ancho = alto = 0, sin embargo si se especifican todos menos
el alto, se creará un cuadrado ya que alto = ancho, lo cual es útil si queremos crear cuadrados.

Ahora haremos una serie de cambios en nuestro código para comenzar a usar nuestros objetos. Primero sustituimos las variables
`x` e `y` por una nueva variable `player`,

``` javascript
let player = null;
```

a la que asignaremos un valor de nuestro nuevo tipo al comienzo de la función `init`,

``` javascript
  // Create player
  player = new Rectangle(300, 150, '#00ff00', 10);
```

después sustituimos el código para dibujar el cuadrado de la función `paint` por una llamada al método `draw` del objeto `player`:

``` javascript
  player.draw(ctx);
```

Por último modificamos las referencias a las variables `x` e `y` en la función `actions` añadiendo `player.` por delante, igual que
hicimos para llamar al método `draw` en `paint` (tranquilo, ya mejoraremos esto más adelante).

Muy bien, ha llegado el momento de añadir un nuevo elemento con el que interactuar al juego. Creamos una nueva variable,

``` javascript
let food = null;
```

le asignamos valor dentro de la función `init`,

``` javascript
  // Create initial food
  food = new Rectangle(450, 280, '#ff0000', 10);
```

y añadimos el codigo para dibujarlo dentro de `paint`:

``` javascript
  food.draw(ctx);
```

Para darle emoción, cada vez que nuestro cuadrado consiga comerse el nuevo elemento, sumamos un punto y recolocamos la comida en
otro punto para volver a intentarlo. Así que tenemos que crear una variable para la puntuación:

``` javascript
let score = 0;
```

También creamos una nueva función para el cálculo de la nueva posición de la comida (genera un valor entre 0 y el valor que le
pasamos como argumento):

``` javascript
function random(max) {
  return Math.floor(Math.random() * max);
}
```

Y añadimos el código dentro de `actions` para incrementar la puntuación y recolocar la comida si el jugador se la come:

``` javascript
  // Food eaten
  if (player.intersects(food)) {
    score += 1; /* also score++ or score = score + 1 */
    food.x = random(canvas.width / 10 - 1) * 10;
    food.y = random(canvas.height / 10 - 1) * 10;
  }
```

Las expresiones que pasamos en las llamadas a `random` tienen como objetivo dividir cada dimensión en secciones iguales de tamaño
10 (generamos una cuadrícula en el lienzo), así que nos devolverá en que fila o columna posicionar la comida. Al multiplicarlas
de nuevo por 10 nos dará las nuevas coordenadas.

Por último sustituimos el antiguo mensaje de tecla pulsada por uno que nos muestre la puntuación actual (en `paint`):

``` javascript
  // Draw score
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Score: ' + score, 0, 20);
```

## Interactuando con varios elementos iguales

Con el sistema actual, cuando el número de elementos con los que interactuar se incrementa, tratar con cada uno de manera
independiente es excesivamente complicado, si además el número varía con el tiempo se convierte en algo casi imposible.
Afortunadamente existe una herramienta que simplifica mucho el trabajo, el vector (array en inglés).

Como ejemplo para ver su uso vamos a añadir 4 elementos fijos, si el jugador choca con alguno de ellos el juego terminará.

Creamos una variable de tipo vector donde guardar los nuevos elementos y otra para indicar el final del juego,

``` javascript
let wall = new Array();
let gameover = false;
```

creamos en `init` los elementos,

``` javascript
  // Create walls
  wall.push(new Rectangle(230, 120, '#999999', 10));
  wall.push(new Rectangle(230, 240, '#999999', 10));
  wall.push(new Rectangle(470, 120, '#999999', 10));
  wall.push(new Rectangle(470, 240, '#999999', 10));
```

añadimos en `paint` el código para pintarlos (usamos un bucle for para recorrer el vector),

``` javascript
  // Draw walls
  for (i = 0, l = wall.length; i < l; i += 1) {
    wall[i].draw(ctx);
  }
```

y en `actions` añadimos el código para detectar las colisiones; si interseccionan con la comida, la reposicionamos, si colisionan
con el jugador finalizamos el juego (lo ponemos en pausa y avisamos de final)

``` javascript
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
```

Una vez llegados a este punto, si el jugador decide intentarlo de nuevo, lo lógico es que el juego comience de nuevo. Para ello
vamos a crear una nueva función `reset` que nos permitirá iniciar el juego desde el principio y eliminar la condición de fin:

``` javascript
function reset() {
  score = 0;
  movingDirection = null;
  player.x = 40;
  player.y = 40;
  food.x = random(canvas.width / 10 - 1) * 10;
  food.y = random(canvas.height / 10 - 1) * 10;
  gameover = false;
}
```

Esta función debe ser llamada justo al inicio del condicional en la función `actions`:

``` javascript
  // GameOver Reset
  if (gameover) {
    reset();
  }
```

Por último cambiamos el código donde mostramos el mensaje de pausa para contemplar la condición de fin:

``` javascript
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
```

## Código final

<div class="game_example">
  <script type="application/javascript" src="assets/game-04.js"></script>
  <canvas id="canvas" width="700" height="350" style="background:#999">[Canvas not supported by your browser.]</canvas>
</div>
<div>&nbsp;</div>

``` javascript
{% include_relative assets/game-04.js %}
```
