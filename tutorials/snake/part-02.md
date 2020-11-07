---
  layout: tutorial
  id: snake
---

## Animación

Ya sabemos añadir contenido gráfico, ahora tenemos que hacer que los elementos del juego puedan moverse, en esta parte vamos a
ver como se añade animación al juego.

Comenzamos por declarar dos nuevas variables, `x` e `y`, para almacenar las coordenadas de nuestro elemento del juego. Añade en
el fichero de código, tras las variables ya existentes, las siguientes líneas:

``` javascript
let x = 50,
    y = 50;
```

Luego modificamos nuestra función `paint` para dibujar un pequeño cuadrado en la posición definida por las variables `x` e `y`.

``` javascript
function paint(ctx) {
  ctx.fillStyle = '#00ff00';
  ctx.fillRect(x, y, 10, 10);
}
```

Actualmente la función `paint` se llama una única vez desde la función `init`, por lo que el contenido sólo se dibuja una vez. Si
queremos conseguir animación tenemos que hacer que `paint` se ejecute a intervalos regulares (*ciclos*). Para conseguirlo creamos
una nueva función, a la que llamamos `run`, y a la que invocaremos desde `init` en vez de la función `paint`:

``` javascript
function run() {
  window.requestAnimationFrame(run);

  actions();
  paint(ctx);
}
```

En la primera línea llamamos a `requestAnimationFrame`, una función del navegador que solicita el repintado de la ventana del
navegador en el próximo ciclo de animación, y que recibe como parámetro una función a la que invoca durante el repintado del
navegador. La frecuencia de los ciclos de animación suele ser de 60 veces por segundo para las pestañas activas. Veremos más
al respecto en la sección [RequestAnimationFrame](./part-07.html).

En las siguientes líneas invocamos a las funciones `actions` y `paint`. La función `paint` ya la conocemos, y la nueva función
`actions` es la encargada de realizar todas las acciones necesarias para modificar el estado de nuestro juego; en este caso la
única acción es mover nuestro cuadro hacia la derecha dos píxeles en cada ejecución:

``` javascript
function actions() {
  x += 2;
}
```

Podríamos poner el código de las acciones en la función `paint`, pero mezclar el codigo de cálculo del estado con el de pintado
facilitaría la aparición de errores difíciles de detectar. Lo recomendable es realizar primero todas las acciones y luego pintar
el resultado de las mismas, además esta separación nos permite organizar mejor el código de cara al mantenimiento de código. Puede
que ahora no veamos las ventajas, pero según se van incrementando las líneas de código el beneficio es más aparente.

Después de guardar el código y recargar la página `index.html` podremos ver, si lo hicimos bien, como el cuadrado se ...

<div class="game_example">
  <canvas id="canvas2" width="600" height="300" style="background:#999">[Canvas not supported by your browser.]</canvas>
</div>

¿Que ocurre? ¡Hemos dibujado una línea horizontal! ¡Eso no es lo que queríamos!

Lo que está sucediendo es que siempre pintamos sobre el mismo *"lienzo"*, cada vez pintamos el mismo cuadrado pero en una nueva
posición que se solapa con la anterior. Para arreglarlo, antes de pintar, debemos limpiar la pantalla (crear un nuevo frame),
esto lo hacemos dibujando un rectángulo del mismo tamaño que el contenedor en un color base. En este ejemplo vamos a usar el color
negro, pero puedes usar el color que más te guste (desde `#000000` hasta `#ffffff` en hexadecimal), [prueba distintos colores](https://www.w3schools.com/colors/colors_rgb.asp){:target="\_blank"}
hasta que encuentres el que más te guste. Añade estas tres líneas al principio de la función `paint`:

``` javascript
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, ctx.width, ctx.height);

```

Guardamos y recargamos de nuevo y ahora podemos ver como el cuadrado se  desplaza hacia la derecha hasta...

<div class="game_example">
  <canvas id="canvas3" width="600" height="300" style="background:#999">[Canvas not supported by your browser.]</canvas>
</div>

desaparecer. Desaparecer, para no volver más. Si queremos verlo otra vez debemos recargar la página, pero volverá a hacer lo
mismo. Para mantener nuestro cuadrado dentro del contenedor tenemos que hacer que vuelva a aparecer por el lado opuesto, añadiendo
las siguientes líneas al final de la función `actions`:

``` javascript

  if (x >= canvas.width)
    x = 0;
```

De esta manera, cuando el valor de `x` supere, o sea igual, que el ancho del contenedor, volveremos a posicionarlo en el extremo
opuesto del mismo.

Et voilà...

## Código final

<div class="game_example">
  <script type="application/javascript" src="assets/game-002.js"></script>
  <canvas id="canvas" width="600" height="300" style="background:#999">[Canvas not supported by your browser.]</canvas>
</div>
<div>&nbsp;</div>
``` javascript
{% include_relative assets/game-02.js %}
```
