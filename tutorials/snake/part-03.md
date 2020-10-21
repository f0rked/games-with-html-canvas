---
  layout: tutorial
  id: snake
---

## Controlar el movimiento

Ahora ya tenemos un objeto moviéndose rápidamente por nuestro lienzo, pero la potencia, sin control... no sirve de nada. El
siguiente paso es poder interactuar con él: indicarle, mediante el teclado, a donde queremos que vaya; para ello necesitamos:

1. **Saber que tecla se ha pulsado**. Cada tecla tiene un valor asignado y vamos a registrar una función que detecte cuando se
presiona una tecla y que almacene su valor para poder consultarlo posteriormente.
2. **Una nueva variable donde guardar el valor de la última tecla pulsada**.

La función `addEventListener` ya la usamos anteriormente para registrar nuestra función de inicialización, ahora nos servirá para
detectar pulsaciones de tecla cambiando el evento que queremos observar (`keydown`) y proporcionándole una función con el código
a ejecutar cuando se presione una tecla (anteriormente le proporcionamos una función ya existente, `init`). Con esto completamos
el primer punto.

``` javascript
document.addEventListener('keydown', function (event) {
  lastPressed = event.key;

  if (lastPressed == KEY_LEFT || lastPressed == KEY_UP || lastPressed == KEY_RIGHT || lastPressed == KEY_DOWN)
    event.preventDefault();
}, false);
```

La función `preventDefault` es una función que impide que el evento javascript se siga propagando hacia los elementos HTML que
contienen nuestro lienzo, si no lo hicieramos así la página se movería mientras jugamos.

En la sección de definición de variables añadimos la nueva variable (inicialmente sin valor, con lo que el objeto estará quieto).
Con esto completamos el segundo punto.

``` javascript
let lastPressed = null;
```

Ahora ya podemos tomar decisiones en el juego en función de la tecla pulsada. Para tener una indicación visual de cuál es la
última tecla pulsada podemos añadir estas líneas en nuestra función `paint`, justo después de limpiar el lienzo:

``` javascript
// Debug last key pressed
ctx.fillStyle = '#ffffff';
ctx.fillText('Last Pressed: ' + lastPressed, 0, 20);
```

Para interactuar utilizaremos las teclas de cursor izquierda, arriba, derecha y abajo; cuyos valores son "ArrowLeft", "ArrowUp",
"ArrowRight" y "ArrowDown" respectivamente. Para identificarlas mejor y facilitar su posible sustitución en un futuro definiremos
unas constantes al inicio de nuestro fichero de código:

``` javascript
const KEY_LEFT = "ArrowLeft",
      KEY_UP = "ArrowUp",
      KEY_RIGHT = "ArrowRight",
      KEY_DOWN = "ArrowDown";
```

Aunque podríamos usar la variable `lastPressed` y estas constantes para gestionar el movimiento es mejor crear unas nuevas para
tal fin, así que definimos una nueva variable:

``` javascript
let movingDirection = null;
```

Esta variable puede tomar un valor emtre 0 y 3, indicando 0 hacia arriba y rotando en el sentido de las agujas del reloj para
los demás valores. Luego creamos unas constantes con estos valores:

``` javascript
const MOVING_UP = 0,
      MOVING_LEFT = 1,
      MOVING_RIGHT = 2,
      MOVING_DOWN = 3;
```

A continuación vamos a separar la gestión del pintado y de las acciones. En el apartado anterior separamos el código en dos
funciones, ahora vamos a programar la ejecución de estas funciones de forma separada. Esto nos va a permitir tener una gestión
del tiempo consistente entre dispositivos (más información en [RequestAnimationFrame](./part-07.html)). La forma más sencilla
para realizar esto es usar dos funciones distintas, una optimizada para el re-pintado y otra para la ejecución de las acciones:

``` javascript
function repaint() {
  window.requestAnimationFrame(repaint);
  paint(ctx);
}

function run() {
  setTimeout(run, 50);
  actions();
}
```

Usamos la nueva función `repaint` para la gestión del pintado, programando mediante el uso de `requestAnimationFrame`. Para la
gestión de las acciones mantenemos la función `run` y usamos `setTimeout` para arrancar un temporizador de 50 ms (20 veces por
segundo). Esto va a provocar que `actions` y `paint` se ejecuten de manera asíncrona, con lo que no podemos asegurar que lo
realizado en la primera sea lo pintado por la segunda, pero al ser la frecuencia de repintado mayor que la del cáculo de acciones
no suele suponer un problema. Por último, no olvides llamar a las nuevas funciones desde `init`.

Vamos a reemplazar el código de la función `actions` con el nuevo código para controlar el movimiento de nuestro cuadrado. En
primer lugar detectamos que tecla ha pulsado el jugador y fijamos la nueva dirección:

``` javascript
  // Check direction
  switch (lastPressed) {
    case KEY_LEFT: dir = MOVING_LEFT; break;
    case KEY_UP: dir = MOVING_UP; break;
    case KEY_RIGHT: dir = MOVING_RIGHT; break;
    case KEY_DOWN: dir = MOVING_DOWN; break;
  }
```

En segundo lugar calculamos la nueva posición en función de la dirección del movimiento:

``` javascript
  // Move rect
  switch (dir) {
    case MOVING_UP: y -= 10; break;
    case MOVING_RIGHT: x += 10; break;
    case MOVING_DOWN: y += 10; break;
    case MOVING_LEFT: x -= 10; break;
  }
```

Y, por último, comprobamos si estamos fuera del lienzo y, de ser así, lo recolocamos saliendo por el lado opuesto:

``` javascript
  // Out screen
  if (x < 0) {
    x = canvas.width - 10;
  } else if (x > canvas.width) {
    x = 0;
  }
  if (y < 0) {
    y = canvas.height - 10;
  } else if (y > canvas.height) {
    y = 0;
  }
```

Antes de cada bloque de código verás que hay una descripción precedida de dos barras diagonales (//), son comentarios, y se usan
para explicar y documentar las distintas secciones de código de cara a posteriores mantenimientos. También nos sirven para
deshabilitar pequeños fragmentos de código durante el desarrollo por motivos de depuración (por ejemplo el código que nos muestra
la tecla pulsada) o pruebas.

Guarda el contenido del fichero de código y recarga la página. Si el código es correcto ahora serás capaz de controlar el movimiento
del cuadrado según se mueve por el lienzo. Si no es así usa la consola de desarrollador del navegador para ver cuál puede ser el
problema.

### Pausar

Ya somos capaces de controlar el movimiento de nuestro cuadrado, pero cada vez que cargamos la página el cuadrado empieza a
moverse de manera indefinida. Vamos a ver como podemos parar y arrancar el movimiento.

Comenzaremos creando una variable donde almacenaremos el estado del juego, inicialmente estará en pausa:

``` javascript
let pause = true;
```

También definiremos una constante con el valor de la tecla que vamos a usar para detectar que el jugador quiere activar/desactivar
el modo pausa (la tecla enter, por ejemplo):

``` javascript
const KEY_ENTER = "Enter";
```

Con el juego en pausa el movimiento está detenido, pero el contenido del lienzo debe seguir mostrándose en el mismo estado en el
que estaba en el momento en el que el jugador lo activó. Lo que haremos será encerrar el contenido de nuestra función `actions`
con un condicional `if (!pause)` (es decir, si no está en pausa). Este condicional, al incluir más de una línea de codigo debe
llevar llaves `{ }` para indicar que lineas queremos abarcar.

Después de este condicional añadimos las siguientes líneas de código al final de la función 'actions':

``` javascript
  // Pause/Unpause
  if (lastPressed == KEY_ENTER) {
      pause = !pause;
      lastPressed = null;
  }
```

Es muy importante que estas líneas queden fuera del condicional anterior, de otro modo no seríamos capaces de desactivar el modo
pausa una vez activado. La asignación `pause = !pause` cambia el estado (de cierto a falso y viceversa) y después asignamos a
`lastPressed` el valor `null` para evitar que el modo pausa cambie contínuamente hasta que el usuario pulse otra tecla.

Por último añadimos al final de la función `paint` el código para que se muestre un mensaje cuando el modo pausa esté activado:

``` javascript
  // Draw pause caption
  if (pause) {
    ctx.textAlign = 'center';
    ctx.fillText('PAUSE', canvas.width / 2, canvas.height / 2);
    ctx.textAlign = 'left';
  }
```

## Código final

<div class="game_example">
  <script type="application/javascript" src="assets/game-03.js"></script>
  <canvas id="canvas" width="700" height="350" style="background:#999">[Canvas not supported by your browser.]</canvas>
</div>
<div>&nbsp;</div>

``` javascript
{% include_relative assets/game-03.js %}
```
