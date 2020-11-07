---
  layout: tutorial
  id: snake
---

## Dibujar

El primer elemento necesario al empezar con el desarrollo es un contenedor donde poder mostrar el juego. En esta primera parte
vamos a crear el contenedor del juego y a mostrar contenido estático en él, algo sencillo para empezar. Para ello vamos a necesitar
dos ficheros:
- Uno con la página HTML en la que se mostrará el juego.
- Otro con el código Javascript del juego.

### HTML

Creamos un fichero, `index.html`, con el siguiente contenido:

``` html
{% include_relative game.html %}
```

No nos detendremos mucho con el código HTML ya que no es necesario para comprender el desarrollo de videojuegos, sólo decir que
el fichero anterior es una página web básica donde vamos a mostrar el juego (mira en la sección de [referencias de la home]({{ "/#references" | relative_url }})
si quieres aprender más sobre HTML). Los dos elementos importantes que hay que comprender son:

``` html
  <script type="application/javascript" src="assets/game.js"></script>
```

El elemento HTML `script` permite incluir código Javascript, en este caso desde el archivo `assets/game.js` con el código de
nuestro juego.

``` html
  <canvas id="canvas" width="700" height="350" style="background:#999">
    [Canvas not supported by your browser.]
  </canvas>
```

El elemento HTML `canvas` (traducido como lienzo en español) es el contenedor para dibujar nuestro juego, le daremos un tamaño
de 600px de ancho por 300 de alto. Puedes variar el tamaño de acuerdo al juego que desarrolles, pero en esta ocasión es
suficiente así. El atributo `id` asigna al elemento un identificador único dentro de la página, esto es necesario para poder
hacer referencia a él desde el código, puedes darle el valor que quieras, pero debe coincidir con el valor usado en el código.

Mediante el atributo `style` le ponemos un color de fondo gris para poder identificarlo dentro de la página. Si hay algún problema
con el código, sólo se mostrará un recuadro de color gris a modo de alerta (aunque también usaremos la consola del navegador para
ayudarnos con la depuración del código). Más adelante puedes cambiarlo si lo deseas.

### Código Javascript

Generalmente, cuando se crea un sitio web, los recursos auxiliares (código Javascript, estilos css, imágenes,...) se almacenan en
un subdirectorio junto al código HTML, nosotros vamos a seguir esta regla. Creamos pues un subdirectorio `assets`, y dentro, un
fichero llamado `game.js` donde copiamos el siguiente contenido:

``` javascript
{% include_relative assets/game-01.js %}
```

Ahora vamos a analizar el código con detenimiento para entenderlo.

Al principio tenemos la sección de declaración de constantes y variables, las palabras reservadas `const` y `let` nos permiten
declararar constantes y variables respectivamente. Declaramos una constante con el identificador del contenedor y dos variables
para almacenar las referencias al propio contenedor y a su contexto gráfico, que es el que usaremos realmente para dibujar.

A continuación definimos la funciones con el código para dibujar el contenido e inicializar el juego.

La función `paint` genera la imagen en el contexto gráfico 2D recibido. Primero fijamos el color para trazos (`#f00`) para dibujar
un rectángulo (coordenadas *x = 170*, *x = 150* y 200px de ancho por 120 de alto) con una semicircunferencia a continuación. El
origen de coordenadas está en la esquina superior izquierda del contexto. Después usamos el color `#0f0` para rellenar el interior
del rectángulo y del semicírculo. Por último escribimos un par de textos. Como verás el contexto gráfico nos provee de funciones
para realizar dibujos y escribir textos, en la sección de [referencias de la home]({{ "/#references" | relative_url }}) puedes
encontrar más información.

La función `init` obtiene la referencia del contenedor (usando su `id`, cuyo valor almacenamos en una constante al inicio del código
y que debe coincidir con el dado al atributo `id` del elemento `canvas` en la página HTML) y del contexto gráfico y las almacena
en las variables definidas para este propósito. Las dos líneas siguientes crean dos propiedades en el objeto `ctx` con el ancho y
alto del contexto y que son usadas en la función `paint` para realizar cálculos al escribir texto. En la última línea de la función
llamamos a la función `paint` pasándole el contexto para dibujar en él.

Por último usamos la función `addEventListener` (existente en el navegador) para registrar nuestra función `init` para que, una
vez terminada de cargar la página, se ejecute. Es importante retrasar la ejecucíon hasta que la página se carge completamente
porque si no podría producirse un error al no encontrar el contenedor.

Una vez guardados los dos archivos, al hacer doble click en `index.html` (y si lo hemos hecho todo bien) se debería cargar una
página web con nuestro contenedor mostrando una figura de color verde con un borde rojo.

Diviértete cambiando los colores y dibujando más figuras, hasta que te familiarices con el uso del contexto.

<div class="game_example">
  <script type="application/javascript" src="assets/game-01.js"></script>
  <canvas id="canvas" width="600" height="300" style="background:#999">[Canvas not supported by your browser.]</canvas>
</div>
<div>&nbsp;</div>

### Depuración

Como dijimos anteriormente si hay algún error en el fichero de código Javascript en la pantalla sólo aparecerá un rectángulo
gris, para poder encontrar cuál es el problema real debes depurar el código.

Todos los navegadores proporcionan una consola que permite ver en tiempo de carga y ejecución los errores que se producen en el
código, con la información allí mostrada podrás resolver cualquier problema que puedas encontrarte mientras estás desarrollando
tus juegos. Estas son las instrucciones para poder activarla:

Chrome
: Presiona F12 o Ctrl + Shift + I y selecciona la pestaña "consola".

Firefox
: Presiona Ctrl + Shift + K y selecciona la pestaña "Consola web". Es recomendable deshabilitar todas las notificaciones excepto
las de JS para que sea más fácil depurar el código.

Internet Explorer
: Presiona F12 y selecciona la pestaña "consola".

Opera
: Presiona Ctrl + Shift + I y selecciona la pestaña "consola".

Safari
: Presiona Ctrl + Shift + I y selecciona la pestaña "consola". Debes habilitar antes "Mostrar menú de desarrollo en la barra de
menú" en la pestaña "Avanzados" de "Preferencias" para usar esta opción.
