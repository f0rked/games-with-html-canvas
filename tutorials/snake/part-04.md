---
  layout: tutorial
  id: snake
---

## Interacción entre elementos

En este punto ya podemos interactuar con el juego usando el teclado, pero otro punto importante es que los distintos elementos
del juego puedan interactuar entre sí. Las interacciones entre elementos del juego suelen ser, principalmente, contactos y para
saber si se está dando esta condición necesitamos saber las coordenadas y las dimensiones de todos los elementos involucrados.

Cuando sólo tenemos un elemento trabajar con variables sueltas es suficiente, pero cuando tenemos varios es necesario cambiar la
forma en la que representamos estos elementos. Vamos a introducir un concepto nuevo, el *"objeto"*. Un *objeto* nos permite
agrupar en una unidad los atributos que definen una entidad y los comportamientos que esta tiene.

En Javascript las funciones, además de contener código para ser llamado posteriormente usando su nombre, también nos permiten
crear objetos. A continuación vamos a crear un objeto `Rectangle` que contendrá las variables para almacenar las coordenadas, el
color y las dimensiones (los *atributos*). Aparte de los *atributos* el objeto también contiene *métodos* (denominación para las
funciones dentro de un objeto) donde codificamos sus comportamientos. Para saber más sobre este tema consulta [Programación orientada a objetos](part-08.html){:target="\_blank"}
o la sección de [referencias de la home]({{ "/#references" | relative_url }}).

Nuestro objeto `Rectangle` tiene dos métodos:

- `doIntersect` - Calcula si el objeto está en contacto (intersección) con otro que se le pasa como argumento.
- `draw` - Dibuja el objeto dentro del contexto que se le pasa como argumento.
{% comment %}- `move`. Calcula la nueva posición del objeto en función de la dirección y la distancia que se le pasan como argumentos.{% endcomment %}

Inserta el siguiente código en el fichero de código, después de la sección de declaración de constantes y variables:

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

  this.draw = function (ctx) {
    if (ctx == null) {
      window.console.warn('Missing parameters on function draw');
    } else {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };

  {% comment %}
  this.move = function (direction, distance) {
    switch (direction) {
      case MOVING_UP: this.y -= distance; break;
      case MOVING_RIGHT: this.x += distance; break;
      case MOVING_DOWN: this.y += distance; break;
      case MOVING_LEFT: this.x -= distance; break;
    }
  };
  {% endcomment %}
}
```

La función `Rectangle` tiene como parámetros los datos necesarios para construir el objeto (coordenadas, color y dimensiones),
el primer bloque de código asigna valores a los atributos usando valores por defecto para los datos que no lleguen. Si no indicamos
nada se creará un objeto con coordenadas x = 0, y = 0, de color blanco (#ffffff) y ancho = alto = 0, sin embargo si se especifican
todos menos el alto, se creará un cuadrado ya que alto = ancho, lo cual es útil si queremos crear cuadrados.

Ahora haremos una serie de cambios en nuestro código para comenzar a usar nuestros objetos. Primero sustituimos las variables
`x` e `y` por una nueva variable `player`,

``` javascript
var player = null;
```

a la que asignaremos un valor de nuestro nuevo tipo al comienzo de la función `init`,

``` javascript
  // Create player
  player = new Rectangle(300, 150, '#00ff00', 10);
```

después sustituimos el código para dibujar el cuadrado de la función `paint` por una llamada al método `draw` del objeto `player`:

``` javascript
  // Draw player
  player.draw(ctx);
```

Por último modificamos las referencias a las variables `x` e `y` en la función `actions` añadiendo "`player.`" por delante, igual que
hicimos para llamar al método `draw` en la función `paint` (tranquilo, ya mejoraremos esto más adelante).

Muy bien, ahora ha llegado el momento de añadir al juego un nuevo elemento con el que interactuar. Creamos una nueva variable,

``` javascript
var food = null;
```

le asignamos valor dentro de la función `init`,

``` javascript
  // Create initial food
  food = new Rectangle(470, 150, '#ff0000', 10);
```

y añadimos el codigo para dibujarlo dentro de `paint`:

``` javascript
  // Draw food
  food.draw(ctx);
```

Todo buen juego tiene que tener un reto para hacerlo atractivo, así que para darle emoción, cada vez que nuestro cuadrado consiga
comerse la comida, sumamos un punto y recolocamos la comida en otro punto para volver a intentarlo. Así que creamos una variable
para la puntuación,

``` javascript
var score = 0;
```

una nueva función para ayudarnos en el cálculo de la nueva posición de la comida (genera un valor entre 0 y el valor que le
pasamos como argumento),

``` javascript
function random(max) {
  return Math.floor(Math.random() * max);
}
```

y el código dentro de `actions` para incrementar la puntuación y recolocar la comida si el jugador se la come:

``` javascript
  // Food eaten
  if (player.intersects(food)) {
    score += 1; /* also score++ or score = score + 1 */
    food.x = random(canvas.width / 10 - 1) * 10;
    food.y = random(canvas.height / 10 - 1) * 10;
  }
```

Las expresiones que usamos como parámetro en las llamadas a `random` tienen como objetivo dividir cada dimensión en secciones
iguales de tamaño 10px (generamos una cuadrícula en el contexto), así que la llamada a la función nos devolverá en que fila o
columna donde posicionar la comida. Al multiplicarlas de nuevo por 10 nos dará la distancia desde el origen de coordenadas en píxeles.

Por último sustituimos el antiguo mensaje con la tecla pulsada por uno que nos muestre la puntuación actual (en `paint`):

``` javascript
  // Draw score
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Score: ' + score, 0, 20);
```

### Interactuando con varios elementos iguales

A pesar de contar con los objetos, cuando el número de elementos con los que interactuar se incrementa, tratar con cada uno de
manera independiente es excesivamente complicado, si además queremos que el número de elementos varíe con el tiempo se convierte
en algo casi imposible. Afortunadamente existe una herramienta que simplifica mucho el trabajo, el *"vector"* (array en inglés).

Como ejemplo para ver su uso vamos a añadir 4 elementos fijos, si el jugador choca con alguno de ellos el juego terminará.

Empezamos por crear una variable de tipo vector donde guardar los nuevos elementos y otra para indicar el final del juego,

``` javascript
var walls = new Array(),
    gameover = false;
```

en la función `init` creamos los elementos,

``` javascript
  // Create walls
  walls.push(new Rectangle(200, 100, '#999999', 10));
  walls.push(new Rectangle(200, 200, '#999999', 10));
  walls.push(new Rectangle(400, 100, '#999999', 10));
  walls.push(new Rectangle(400, 200, '#999999', 10));
```

añadimos en `paint` el código para pintarlos,

``` javascript
  // Draw walls
  for (i = 0, l = walls.length; i < l; i += 1) {
    walls[i].draw(ctx);
  }
```

y en `actions` añadimos el código para detectar las colisiones contra los nuevos elementos; si alguno intersecciona con la comida,
la reposicionamos, si colisionan con el jugador finalizamos el juego (lo ponemos en pausa y avisamos de final)

``` javascript
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
```

Como puedes ver en el código la forma de tratar con los vectores es usando bucles (en este caso un bucle `for`) para recorrerlos.

En caso de producirse una colisión, si el jugador decide intentarlo de nuevo, lo lógico es que el juego comience de nuevo. Para ello
vamos a crear una nueva función `reset` que nos permitirá iniciar el juego desde el principio y eliminar la condición de fin:

``` javascript
function reset() {
  score = 0;
  movingDirection = MOVING_RIGHT;
  player.x = 300;
  player.y = 150;
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
    ctx.fillStyle = '#ffffff';
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
  <canvas id="canvas" width="600" height="300" style="background:#999">[Canvas not supported by your browser.]</canvas>
</div>
<div>&nbsp;</div>

``` javascript
{% include_relative assets/game-04.js %}
```
