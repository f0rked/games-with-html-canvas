---
  layout: tutorial
  id: snake
---

## Dibujando en el canvas

En esta primera parte vamos a crear el área del juego y a mostrar algo de contenido estático, algo sencillo para empezar. Para
ello vamos a necesitar dos ficheros:
- Uno con la página HTML en la que se mostrará el juego.
- Otro con el código Javascript del juego.

Comencemos creando un fichero index.html con el siguiente contenido:

``` html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My First Canvas Game</title>

    <script type="application/javascript" src="game.js"></script>
  </head>

  <body>
    <h1>My First Canvas Game</h1>

    <p>
      <canvas id="canvas" width="600" height="300" style="background:#999">[Canvas not supported by your browser.]</canvas>
    </p>
  </body>
</html>
```

No vamos a detenernos a explicar el código HTML ya que no es necesario para comprender el desarrollo de videojuegos, tan sólo
digamos que el código anterior es lo básico para mostrar una página web donde mostrar el juego. Sólo hay dos líneas importantes
que debes comprender:

``` html
<script type="application/javascript" src="game.js"></script>
```

Mediante el elemento `script` incluimos el archivo `game.js`, que contendrá el código de nuestro juego.

``` html
<canvas id="canvas" width="600" height="300" style="background:#999">[Canvas not supported by your browser.]</canvas>
```

El elemento `canvas` es donde dibujaremos nuestro juego y le daremos un tamaño de 600px de ancho por 300px de alto. Puedes
personalizar el tamaño de acuerdo al juego que desarrolles, pero para nosotros es suficiente así.

El atributo `id` es el identificador único del elemento dentro de la página y es necesario para poder hacer referencia a él
desde el código del juego, puedes darle el valor que quieras, pero debe coincidir con el valor que uses dentro del código.

Por último le ponemos un color de fondo gris para identificar donde se encuentra dentro de la página. Si hubiera algún problema
con la página, sólo se mostrará el color gris a modo de alerta (aunque también usaremos la consola del navegador para ayudarnos
con la depuración del código). Más adelante puedes cambiarlo si lo deseas, pero de momento lo dejaremos así.

Ahora crearemos el código de nuestro juego, algo sencillo como dijimos al principio. Crea un fichero llamado `game.js` y copia
en él el siguiente contenido:

``` javascript
{% include_relative assets/game-01.js %}
```

Vamos a analizar el código poco a poco para entenderlo. Al principio declaramos las variables donde almacenaremos el nombre del
lienzo (la traducción de canvas en español) que vamos a usar, el propio lienzo y su contexto gráfico 2D, que es la herramienta
que usaremos para dibujar. Inicialmente no tendrán valor asignado.

Luego definimos la función `paint`, que usaremos para generar la imagen el el contexto gráfico 2D recibido. Primero seleccionamos
el color que queremos usar (`#f00`) y luego dibujamos un rectángulo en la posición *x = 50*, *x = 50* (el origen de coordenadas
está en la esquina superior izquierda del lienzo), con 100px de ancho y 60px de alto. Después usaremos el color `0f0` para
rellenar el interiór del rectángulo.

La función `init` obtiene la referencia del lienzo usando su `id`, que almacenamos en una variable al inicio del código con el
valor que usamos en la página HTML, y del contexto gráfico y las almacena en las variables que definimos al inicio del código.
En la última línea de la función llamamos a nuestra función `paint` pasándole el contexto del lienzo para dibujar en él.

Por último usamos la función `addEventListener`, definida en el navegador, para registrar nuestra función `init` para que, cuando
se termine de cargar la página, se ejecute. Es importante que retrasemos la ejecucíon hasta que la página se carge completamente
porque si no podría producirse un error al no encontrar el lienzo.

Una vez guardados los dos archivos, al hacer doble click en `index.html` y si lo hemos hecho todo bien, se debería cargar una
página web con nuestro, lienzo mostrando un rectángulo verde con vorde rojo.

Diviértete cambiando los colores y dibujando más rectángulos, hasta que te familiarices con el lienzo.

<div class="game_example">
  <script type="application/javascript" src="assets/game-01.js"></script>
  <canvas id="canvas" width="700" height="350" style="background:#999">[Canvas not supported by your browser.]</canvas>
</div>
