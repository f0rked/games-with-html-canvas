---
  layout: tutorial
  id: snake
---

# El juego terminado

Ya tenemos las bases necesarias para terminar el juego de la serpiente. Ahora hay que retocar ciertos detalles y conseguir una
versión del juego que sea funcional, posteriormente seguiremos añadiendo mejoras hasta conseguir un juego completamente operativo
y fácil de mantener.

En primer lugar eliminamos los elementos añadidos en la última parte de la sección anterior (las paredes), ya que no forman parte
del juego, pero si quieres mantenerlos comenta el código y al final decidide si quieres volver a recuperarlas.

La serpiente es el personaje principal del juego, comienza con un tamaño de tres elementos y va creciendo según va comiendo las
manzanas que aparecen en el juego, para implementar este comportamiento vamos a usar un *vector*. Reemplazamos la variable `player`
por otra llamada `snake`:

``` javascript
let snake = new Array();
```

En el código existente debemos sustituir cada referencia a `player` por `snake[0]`, la cabeza de la serpiente, por ejemplo, donde
antes aparecía `player.x` ahora aparecerá `snake[0].x`. Puedes usar las funciones de *Buscar* y *Reemplazar* de tu editor para
que sea más sencillo.

En la función `init` definimos una posición inicial para cada uno de los tres objetos de tipo 'Rectangle' que forman el cuerpo:

``` javascript
  // Create snake
  snake.push(new Rectangle(300, 150, '#00ff00', 10));
  snake.push(new Rectangle(290, 150, '#00ff00', 10));
  snake.push(new Rectangle(280, 150, '#00ff00', 10));
```

De la misma manera, la función `reset` debe volver la serpiente a su tamaño y posición inicial. En este caso debemos resetear el
tamaño del vector, lo que elimina todas las partes conseguidas durante la partida anterior, y reposicionar el cuerpo:

``` javascript
  snake.length = 0;
  snake.push(new Rectangle(300, 150, '#00ff00', 10));
  snake.push(new Rectangle(290, 150, '#00ff00', 10));
  snake.push(new Rectangle(280, 150, '#00ff00', 10));
```

A la hora de pintar a nuestro personaje debemos tener en cuenta que hay que hacerlo con todos sus elementos, para ello tenemos
que usar un bucle `for` en la función `paint`:

``` javascript
  // Draw snake
  for (i = 0; i < snake.length; i++) {
    snake[i].draw(ctx);
  }
```

En la función `actions` añadimos todo el código necesario para la nueva gestión del movimiento.

El cuerpo debemos moverlo en orden inverso, de atrás hacia adelante, pero sólo si hay dirección de movimiento (cuando no hay
dirección de movimiento la cabeza no se mueve, si el cuerpo lo hiciera se detectaría un choque). Todos los elementos del cuerpo,
excepto la cabeza, toman la posición del elemento anterior en el vector. Este código va antes que el movimiento de la cabeza:

``` javascript
  // Move snake's body
  if (movingDirection != null) {
    for (i = snake.length - 1; i > 0; i--) {
      snake[i].x = snake[i - 1].x;
      snake[i].y = snake[i - 1].y;
    }
  }
```

Para detectar si la cabeza ha chocado con algún otro segmento del cuerpo, lo que finaliza la partida, usamos el siguiente código:

``` javascript
  // Body Intersects
  for (i = snake.length - 1; i > 1; i--) {
    if (snake[0].intersects(snake[i])) {
      gameover = true;
      pause = true;
    }
  }
```

Habrás notado que comprobamos los segmentos coemzando desde atrás (es más probable que el choque se produzca con los últimos
segmentos) y que nos paramos en el tercer segmento, esto es porque la cabeza (segmento 0) nunca puede chocar con el cuello
(segmento 1).

Por último, añadimos un segmento al cuerpo de la serpiente cuando se coma una manzana. Añadimos la siguiente línea dentro del
condicional que detecta que la serpiente se ha comido la manzana (no es necesario indicar coordenadas, en el siguiente ciclo se
  recalcularán automáticamente):

``` javascript
  snake.push(new Rectangle(0, 0, '#00ff00', 10));
```

Adicionalmente debemos ignorar cualquier orden por parte del usuario del juego de realizar un movimiento en sentido opuesto, es
decir, si la serpiente se mueve hacia la derecha y el usuario cambia la dirección hacia la izquierda debemos ignorar este movimiento
y seguir en la dirección actual. Para conseguir esto sustituimos la primera línea del código de la función que registra la pulsación
de teclas por:

``` javascript
  if (lastPressed == KEY_LEFT && event.key == KEY_RIGHT) ;
  else if (lastPressed == KEY_UP && event.key == KEY_DOWN) ;
  else if (lastPressed == KEY_RIGHT && event.key == KEY_LEFT) ;
  else if (lastPressed == KEY_DOWN && event.key == KEY_UP) ;
  else
    lastPressed = event.key;
```

Un sólo `;` significa la instrucción vacía, no hacer nada, así que sólo registramos la tecla cuando la orden no sea la opuesta a
la actual.

## Multimedia

Ahora que ya tenemos toda la funcionalidad implementada vamos a introducir contenido multimedia. Como ya comentamos al principio,
en un juego, tanto o más importante que la jugabilidad (la trama del juego, lo fácil que es manejarlo) es el interfaz (aspecto
gráfico y el sonido). Hasta ahora sólo nos hemos centrado en lo primero, ahora vamos a ocuparnos de lo segundo, vamos a dotar
al juego de elementos gráficos y auditivos que lo hagan más atractivo.

En cuanto al aspecto gráfico, es muy importante hacer notar que el tamaño de los *sprites* (así se denominan a las imágenes que
representan partes del juego) está íntimamente relacionado con el de los componentes que hemos estado dibujando, si no son del
mismo tamaño podría parecer que los componentes no se tocan cuando en realidad es así, o viceversa.

Para empezar necesitaremos un editor gráfico (MS paint en Windows, Preview en MacOS, KolourPaint en Linux, Gimp,...) para poder
generar las imágenes que usaremos como sprites. En nuestro caso dibujamos imágenes de 10x10 píxeles, una con forma de fruta para
la comida y otra para cada una de las secciones del cuerpo. Luego guardaremos estas imágenes en una carpeta que llamaremos `assets`
en el mismo directorio que la ṕagina HTML del juego. En la sección [Recursos multimedia](#resources) puedes encontrar las imágenes
usadas en el tutorial.

Una vez que tenemos nuestros sprites listos creamos dos variables de tipo `Image`,

``` javascript
let sectImg = new Image(),
    foodImg = new Image();
```

a las que asignamos valor en la función `init`.

``` javascript
  // Load assets
  sectImg.src = "assets/sect.png";
  foodImg.src = "assets/apple.png";
```

Para poder pintar la imagen esta debe ser accesible por el método `draw` de nuestra clase `Rectangle`, de momento vamos a pasarla
como segundo parámetro de esta función y a usarla en el código de la misma. En el caso de que no se indique una imagen dejaremos
el código anterior para que se dibuje la figura en el color definido en la creación del objeto. El método queda entonces de la
siguiente manera:

``` javascript
  this.draw = function (ctx, bkgImg) {
    if (ctx == null) {
      window.console.warn('Missing parameters on function draw');
    } else {
      if (bkgImg) {
        ctx.drawImage(bkgImg, this.x, this.y)
      } else {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    }
  };
```

Del mismo modo debemos modificar la función `paint` para pasar los sprites a las funciones `paint` de la serpienta y la comida:

``` javascript
  // Draw snake
  for (i = 0; i < snake.length; i++) {
    snake[i].draw(ctx, sectImg);
  }

  food.draw(ctx, foodImg);
```

Al guardar y recargar la página de nuestro juego podemos ver como ahora se muestran nuestras imágenes en vez de los cuadrados de
colores.

Para acabar con el contenido multimedia vamos a incluir un par de sonidos para marcar eventos importantes del juego, cada vez que
la serpiente coma una manzana, y cuando la serpiente muera y el juego termine. En la sección [Recursos multimedia](#resources)
puedes encontrar los sonidos usados en el tutorial.

Creamos las variables de tipo `Audio`,

``` javascript
let eat = new Audio(),
    over = new Audio();
```

les asignamos valor en la función `init`,


``` javascript
  eat.src = "assets/eat.oga";
  over.src = "assets/over.oga";
```

e incluimos una llamada al método `play` en el momento adecuado:


``` javascript
  // Body Intersects
  for (i = snake.length - 1; i > 1; i--) {
    if (snake[0].intersects(snake[i])) {
      over.play();
      gameover = true;
      pause = true;
    }
  }

  // Food eaten
  if (snake[0].intersects(food)) {
    eat.play();
    score += 1; // also score++ or score = score + 1
    snake.push(new Rectangle(0, 0, '#00ff00', 10));
    food.x = random(canvas.width / 10 - 1) * 10;
    food.y = random(canvas.height / 10 - 1) * 10;
  }
```

## Recursos Multimedia {#resources}

A continuación te proporcionamos los recursos que hemos utilizado. Click derecho sobre cada enlace y "Guardar enlace como":

- [Imagen de la manzana](assets/apple.png).
- [Imagen del cuerpo](assets/sect.png).
- [Sonido comer](assets/eat.oga).
- [Sonido finalizar](assets/over.oga).

## Código final

<div class="game_example">
  <script type="application/javascript" src="assets/game-05.js"></script>
  <canvas id="canvas" width="700" height="350" style="background:#999">[Canvas not supported by your browser.]</canvas>
</div>
<div>&nbsp;</div>

``` javascript
{% include_relative assets/game-05.js %}
```
