---
  layout: tutorial
  id: snake
---

## Introducir animación

Un juego no es sólo dibujar, también tenemos que interactuar con otros elementos, en esta parte vamos a ver como podemos añadir
movimiento en nuestro juego.

En primer lugar vamos a añadir la declaración de dos nuevas variables, `x` e `y`. Añade al comienzo de nuestro fichero, tras las
variables ya existentes, las siguientes líneas:

``` javascript
let x = 50,
    y = 50;
```

Luego modificamos nuestro función `paint` para limpiar la pantalla antes de volver a pintar, esto lo hacemos dibujando un
rectángulo del mismo tamaño que el lienzo. Por último dibujamos un cuadrado más pequeño en la posición definida mediante las
variables `x` e `y`. En este ejemplo estamos "limpiando" con el color negro, pero puedes usar el color que más te guste (desde
`#000000` hasta `#ffffff` en hexadecimal), [prueba distintos colores](https://www.w3schools.com/colors/colors_rgb.asp){:target="\_blank"}
hasta que encuentres el que más te guste.

``` javascript
function paint(ctx) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#00ff00';
  ctx.fillRect(x, y, 10, 10);
}
```

Actualmente la función `paint` se llama una única vez desde la función `init`, por lo que el lienzo sólo se dibuja una vez. Para
conseguir movimiento tenemos que hacer que `paint` se ejecute a intervalos regulares. Para conseguirlo creamos una nueva función,
`run`, a la que invocaremos desde `init` en vez de la función `paint`:

``` javascript
function run() {
  window.requestAnimationFrame(run);
  actions();
  paint(ctx);
}
```

En la primera línea de la función invocamos a `requestAnimationFrame`, una función del navegador que solicita el repintado de la
ventana del navegador en el próximo ciclo de animación, y que recibe como parámetro una función a la que llama antes de efectuar
el repintado. Generalmente suele funcionar a una frecuencia de 60 veces por segundo para pestañas activas. Para saber más al
respecto consulta [RequestAnimationFrame](./part-07.html)

En las siguientes líneas invocamos a las funciones `actions` y `paint`. La función `paint` ya la conocemos, la nueva función
`actions` se encargará de realizar todas las acciones necesarias para modificar el estado de nuestro juego; en este caso vamos
a mover nuestro cuadro hacia la derecha dos píxeles:

``` javascript
function actions() {
  x += 2;
}
```

Podríamos poner el código de las acciones en la función `paint`, pero esto facilitaría la aparición de errores difíciles de
detectar. Lo recomendable es realizar primero todas las acciones y luego pintar el resultado de las mismas, además esta separación
nos permite organizar mejór el código de cara a posteriores mantenimientos.

Después de guardar el código y recargar la página `index.html` podrémos ver, si lo hicimos bien, como el cuadrado se desplaza
hacia la derecha hasta... desaparecer.

Desaparecer, para no volver más. Si queremos verlo otra vez debemos recargar la página, pero volverá a hacer lo mismo. Para
mantener nuestro cuadrado dentro de lienzo podemos hacer que vuelva a aparecer por el lado izquierdo añadiendo las siguientes
líneas al final de la función `actions`:

``` javascript
  if (x > canvas.width)
    x = 0;
```

De esta manera, cuando el valor de `x` supere el ancho del lienzo, volveremos a posicionarlo en el extremo opuesto del mismo.


## Código final

<div class="game_example">
  <script type="application/javascript" src="assets/game-02.js"></script>
  <canvas id="canvas" width="700" height="350" style="background:#999">[Canvas not supported by your browser.]</canvas>
</div>
<div>&nbsp;</div>
``` javascript
{% include_relative assets/game-02.js %}
```
