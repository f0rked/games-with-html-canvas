---
  layout: tutorial
  id: snake
---
## Nuestro primer juego, Snake

En este primer tutorial vamos a programar un juego moderadamente simple, *"Snake"*. El objetivo del juego es mover una serpiente
por el tablero para comerse las manzanas que van apareciendo. El juego termina si la cabeza de la serpiente toca alguna parte
del cuerpo de la misma.

Existen dos variantes del juego; en una el tablero es infinito, lo que significa que si salimos por un extremo apareceremos por
el extremo contrario; en la otra el tablero está limitado en sus extremos, con lo que si chocamos con los mismos el juego también
acaba. Nosotros vamos a implementar la primera opción, pero para cuando acabemos seguro que eres capaz de modificarlo para obtener
la segunda variante.

Aunque este site y sus tutoriales están escritos en Español el código del videojuego estará escrito en Inglés, esto es un estandard
*"de facto"* en el mundo del desarrollo de software.

Aquí puedes ver el resultado final:

<div class="game_example">
  <script type="application/javascript" src="assets/game.js"></script>
  <canvas id="canvas" width="700" height="350" style="background:#999">[Canvas not supported by your browser.]</canvas>
</div>

Divertido ¿verdad?, vamos a comenzar con el desarrollo el videojuego...
