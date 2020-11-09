---
  layout: tutorial
  id: snake
---

## Controlar el movimiento

Ahora ya tenemos un objeto moviéndose rápidamente por nuestro contenedor, pero la potencia, sin control... no sirve de nada. El
siguiente paso es poder interactuar con él: indicarle, mediante el teclado, a donde queremos que vaya; para ello necesitamos:

1. **Saber que tecla se ha pulsado**. Cada tecla tiene un valor asignado y vamos a registrar una función que detecte cuando se
presiona una tecla y que almacene su valor para poder consultarlo posteriormente.
2. **Una nueva variable donde guardar el valor de la última tecla pulsada**.

La función `addEventListener`, que ya la usamos para registrar nuestra función de inicialización, ahora nos servirá para detectar
pulsaciones de tecla, cambiando el evento que queremos observar (`keydown`) y proporcionándole una nueva función con el código a
ejecutar cuando se presione una tecla (anteriormente le proporcionamos una función ya existente, `init`, ahora creamos una función
anónima). Con esto completamos el primer punto.

``` javascript
document.addEventListener('keydown', function (event) {
  lastPressed = event.key;

  if (lastPressed == KEY_UP || lastPressed == KEY_RIGHT ||
      lastPressed == KEY_DOWN || lastPressed == KEY_LEFT)
    event.preventDefault();
}, false);
```

La función `preventDefault` impide que el evento javascript se siga propagando hacia los elementos HTML que contienen a nuestro
elemento `canvas`, si no lo hicieramos así la página se movería mientras jugamos.

En la sección de definición de variables añadimos la nueva variable (inicialmente sin valor, con lo que el objeto no tiene
movimiento). Con esto completamos el segundo punto.

``` javascript
var lastPressed = null;
```

Ahora ya podemos tomar decisiones en el juego en función de la tecla pulsada. Para tener una indicación visual de cuál es la
última tecla pulsada podemos añadir estas líneas en nuestra función `paint`, justo después de limpiar el contexto:

``` javascript
// Debug last key pressed
ctx.fillStyle = '#ffffff';
ctx.fillText('Last Pressed: ' + lastPressed, 0, 20);
```

Para interactuar vamos a usar las teclas de cursor izquierda, arriba, derecha y abajo; cuyos valores son *"ArrowLeft"*, *"ArrowUp"*,
*"ArrowRight"* y *"ArrowDown"* respectivamente. Para identificarlas mejor y facilitar su posible sustitución en un futuro definimos
unas constantes al inicio de nuestro fichero de código:

``` javascript
var KEY_UP = "ArrowUp",
    KEY_RIGHT = "ArrowRight",
    KEY_DOWN = "ArrowDown",
    KEY_LEFT = "ArrowLeft";
```

Aunque podríamos usar la variable `lastPressed` y estas constantes para gestionar el movimiento es mejor crear unas nuevas para
tal fin, así que definimos una nueva variable:

``` javascript
var movingDirection = null;
```

Esta variable puede tomar un valor emtre 0 y 3, indicando 0 hacia arriba y rotando en el sentido de las agujas del reloj para
los demás valores. Creamos unas constantes con estos valores:

``` javascript
var MOVING_UP = 0,
    MOVING_RIGHT = 1,
    MOVING_DOWN = 2,
    MOVING_LEFT = 3;
```

A continuación vamos a separar la gestión del pintado y de las acciones. En el apartado anterior separamos el código en dos
funciones, ahora vamos a programar la ejecución de estas funciones de forma separada. Esto nos va a permitir tener una gestión
del tiempo consistente entre dispositivos (más información en [RequestAnimationFrame](./part-07.html)). La forma más sencilla
para realizar esto es usar dos funciones distintas, una optimizada para el repintado y otra para la ejecución de las acciones:

``` javascript
function repaint() {
  window.requestAnimationFrame(repaint);
  paint(ctx);
}

function run() {
  setTimeout(run, 40);
  actions();
}
```

Usamos la nueva función `repaint` para la gestión del pintado, programando mediante el uso de `requestAnimationFrame`. Para la
gestión de las acciones mantenemos la función `run` pero vamos a usar `setTimeout` para arrancar un temporizador de 40 ms (25
veces por segundo). Esto va a provocar que `actions` y `paint` se ejecuten de manera asíncrona, con lo que no podemos asegurar
que lo realizado en la primera sea lo pintado por la segunda, pero al ser la frecuencia de repintado mayor que la del cáculo de
acciones no va a suponer un problema. Por último, no olvides llamar a las nuevas funciones desde `init`.

Vamos a reemplazar el código de la función `actions` con el nuevo código para controlar el movimiento de nuestro cuadrado. En
primer lugar detectamos que tecla ha pulsado el jugador y fijamos la nueva dirección:

``` javascript
  // Check direction
  switch (lastPressed) {
    case KEY_UP: movingDirection = MOVING_UP; break;
    case KEY_RIGHT: movingDirection = MOVING_RIGHT; break;
    case KEY_DOWN: movingDirection = MOVING_DOWN; break;
    case KEY_LEFT: movingDirection = MOVING_LEFT; break;
  }
```

En segundo lugar calculamos la nueva posición en función de la dirección del movimiento:

``` javascript
  // Move rect
  switch (movingDirection) {
    case MOVING_UP: y -= 10; break;
    case MOVING_RIGHT: x += 10; break;
    case MOVING_DOWN: y += 10; break;
    case MOVING_LEFT: x -= 10; break;
  }
```

Y, por último, comprobamos si estamos fuera del contenedor y, de ser así, lo recolocamos saliendo por el lado opuesto:

``` javascript
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
```

Antes de cada bloque de código verás que hay una descripción precedida de dos barras diagonales (//), son comentarios, y se usan
para explicar y documentar las distintas secciones de código de cara a posteriores mantenimientos. También nos sirven para
deshabilitar pequeños fragmentos de código durante el desarrollo por motivos de depuración (por ejemplo el código que nos muestra
la tecla pulsada) o pruebas.

Guarda el contenido del fichero de código y recarga la página. Si el código es correcto ahora serás capaz de controlar el movimiento
del cuadrado según se mueve por el contenedor. Si no es así usa la consola de desarrollador del navegador para ver cuál puede ser el
problema.

### Pausar

Ya somos capaces de controlar el movimiento de nuestro cuadrado, pero una vez que el cuadrado comienza a moverse, sigue así de
manera indefinida. Vamos a ver como podemos parar y arrancar el movimiento.

Creamos una variable donde almacenar el estado del juego, inicialmente el juego está en pausa:

``` javascript
var pause = true;
```

También definimos una constante con el valor de la tecla que vamos a usar para detectar que el jugador quiere activar/desactivar
el modo pausa (la tecla *"Enter"*, por ejemplo):

``` javascript
var KEY_ENTER = "Enter";
```

Con el juego en pausa el movimiento queda detenido, pero el contenido del juego debe seguir mostrándose en el mismo estado en el
que estaba en el momento en el que el jugador lo activó. Para parar el movimiento encerramos el código dentro de nuestra función
`actions` con un condicional `if (!pause)` (es decir, si no estamos en pausa). Este condicional, al incluir más de una línea de
codigo debe llevar llaves `{ }` para indicar que lineas queremos abarcar.

Después de este condicional añadimos las siguientes líneas de código al final de la función 'actions' para activar y desactivar
el modo pausa:

``` javascript
  // Pause/Unpause
  if (lastPressed == KEY_ENTER) {
      pause = !pause;
      lastPressed = null;
  }
```

Es muy importante que estas líneas queden fuera del condicional anterior, de otro modo no seríamos capaces de desactivar el modo
pausa una vez activado. La asignación `pause = !pause` cambia el estado (de cierto a falso y viceversa) y después asignamos a
`lastPressed` el valor `null` para evitar que el modo pausa cambie indefinidamente hasta que el usuario pulse otra tecla.

Por último añadimos al final de la función `paint` el código para que se muestre un mensaje cuando el modo pausa esté activado:

``` javascript
  // Draw pause caption
  if (pause) {
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSE', canvas.width / 2, canvas.height / 2);
    ctx.textAlign = 'left';
  }
```

## Código final

<div class="game_example">
  <script type="application/javascript" src="assets/game-03.js"></script>
  <canvas id="canvas" width="600" height="300" style="background:#999">[Canvas not supported by your browser.]</canvas>
</div>
<div>&nbsp;</div>

``` javascript
{% include_relative assets/game-03.js %}
```
