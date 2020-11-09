---
  layout: tutorial
  id: snake
---

## RequestAnimationFrame

En el pasado, para crear temporizadores, sólo existía la función `setTimeout`. Esta función ha servido durante mucho tiempo para
la ejecución programada de toda clase de acciones en páginas web, pero no está diseñada para implementar animaciones, que requieren
de múltiples llamadas por segundo. El uso de esta función para crear animaciones (para juegos en nuestro caso) está desaconsejado
ya que incrementa notablemente el consumo de recursos, incluso si no estamos usando la aplicación animada.

La respuesta de los fabricantes de navegadores web ha sido la función `requestAnimationFrame`. Esta función optimiza el consumo
de recursos ejecutándose de forma automática tan pronto como la CPU está disponible (generalmente unas 60 veces por segundo en
computadoras normales), mejorando las capacidades de procesado para animaciones, consumiendo menos recursos e, incluso, suspendiendo
la ejecución si la aplicación no está activa.

Para usar la función `requestAnimationFrame` sólo tienes que invocarla al principio de otra función, pasando como argumento la
propia función invocante para que sea llamada posteriormente.

``` javascript
function run() {
  window.requestAnimationFrame(run);
  // do actions ....
}
```

`requestAnimationFrame(run)` es equivalente a `setTimeout(run,17)`, pero de forma optimizada.

### Soporte para navegadores antiguos

Aunque prácticamente todos los navegadores modernos ya tienen esta función, hay veces que es necesario dar soporte a otros
navegadores antiguos o navegadores que no dan soporte a alguna función.

La solución en estos casos es crear una función en el navegador (a través del objeto `window`) con el nombre de la función que
pretendemos usar (si ya existe, la sobreescribimos) y le asignamos la mejor opción disponible. Un ejemplo para nuestra función:

``` javascript
window.requestAnimationFrame = (function () {
   return window.requestAnimationFrame ||
     window.webkitRequestAnimationFrame ||
     window.mozRequestAnimationFrame ||
     function (callback) {
       window.setTimeout(callback, 17);
     };
 } ());
```

Usamos una función auto-ejecutable para calcular la mejor opción posible; si ya existe la función la devolvemos (en este caso
sobresscribimos con el mismo valor), si no, probamos con la función equivalente en navegadores *webkit* (*Chrome* y *Safari*)
antiguos; si tampoco encontramos esta probamos con la función equivalente en navegadores *mozilla* antiguos (*Firefox*); y si
también fallamos con esta usamos una que seguro que existirá y que hemos visto antes `setTimeout` con la parametrización más
parecida. Como ves lo que devolvemos es una función anónima que recibe como parámetro la función a llamar y que invoca a
`setTimeout` con la función recibida y el tiempo equivalente.

### Calculo de cuadros por segundo (fps)

A continuación os mostramos un objeto que nos permite calcular los fps (frames per second) o cuadros por segundo de los que es
capaz nuestra computadora:

``` javascript
window.fpsCalculator = {
  lastTime: 0,
  fps: 0,
  frames: 0,
  acumDelta: 0,
  update: function() {
    let now = Date.now(),
        delta = (now - this.lastTime) / 1000;

    if (delta > 1)
      delta = 0;

    this.lastTime = now;
    this.frames++;
    this.acumDelta += delta;

    if (this.acumDelta > 1) {
      this.fps = this.frames;
      this.frames = 0;
      this.acumDelta -= 1;
    }
  }
};
```
Para ver este objeto en funcionamiento vamos a partir del código de la sección [Introducir animación](part-02.html) e introducimos
nuestro objeto para mostrar en el juego los fps, una llamada a la función `update` en la función `run` y también un texto para
mostrar el valor en la función `paint`.

``` javascript
{% include_relative assets/game-07.js %}
```
<div>&nbsp;</div>
<div class="game_example">
  <script type="application/javascript" src="assets/game-07.js"></script>
  <canvas id="canvas" width="600" height="300" style="background:#999">[Canvas not supported by your browser.]</canvas>
</div>
<div>&nbsp;</div>
### Regulando el tiempo entre dispositivos

Debido a la diferencia de capacidades entre dispositivos `requestAnimationFrame` no es consistente entre ellos, su tiempo de
actualización es mayor en dispositivos de menor potencia, lo que hace los juegos más lentos en unos dispositivos que en otros.
Para evitar este problema, es necesario un mecanismo para homogeneizar la frecuencia de ejecución en todos los dispositivos.

Existen varias formas, veamos las dos más conocidas y eficientes:

#### *requestAnimationFrame* para pintar, *setTimeout* para cálculo de acciones

La primera forma es separar el pintado del cálculo a de acciones de manera que cada una se ejecute a su propio ritmo optimizando
los tiempos de cada una.

Lo más sencillo para implementarlo es usar `requestAnimationFrame` para el pintado y `setTimeout` para el cálculo de las acciones, creando dos funciones distintas:

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

Las dos funciones se llamarán en la inicialización y cada una proseguirá de forma asíncrona.

Ventajas:
- Sencillo de implementar.
- Efectivo en tiempos altos.

Inconvenientes:
- Asícrono. A veces puede ser necesaria la interacción entre cálculo de acciones y pintado, al ejecutarse de manera asíncrona
estos datos pueden no corresponder y generarse errores aleatorios.
- Poco efectivo en tiempos bajos.
- El cálculo de acciones sigue consumiendo CPU si el juego pasa a segundo plano, aunque puede habilitarse un mecanismo para
detener el timer.

#### Usar incrementos de tiempo

Es el método más efectivo y, además, relativamente sencillo de implementar. Consiste en desplazar los objetos la parte proporcional
correspondiente al tiempo transcurrido desde la última vez, de esta manera garantizamos que los objetos se mueven siempre a la
misma velocidad (píxeles por segundo) independientemente de los fps del dispositivo.

El valor del incremento de tiempo es el calculado en el punto anterior (`delta = (lastTime - now()) / 1000`) y el factor de
multiplicación es el número de píxeles que queremos mover en un segundo a los fps que queremos, es decir, si queremos mover 2
píxeles por ciclo a una frecuencia de 60 fps entonces el desplazamiento por segundo es de `2 * 60 = 120`.

Una vez calculados estos valores, en cada ejecución de la función el desplazamiento correspondiente sería `x += 120 * delta`. Lo
más sencillo es hacer el cálculo en la función `run` y pasar `delta` como parámetro a la función `actions`.

Hay que tener en cuenta que este cálculo es necesario realizarlo para cada movimiento y animación para poder garantizar la
consistencia, así que en juegos con muchas interacciones puede ser complicado de implementar. Aún así es el más efectivo.

Ventajas:
- Siempre fiable y consistente.
- Los animaciones son tan fluidas como la CPU lo permita.

Inconvenientes:
- Dificil de mantener con interacciones complicadas.
- El juego se congela al pasar a segundo plano.
