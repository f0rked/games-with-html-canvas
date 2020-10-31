---
  layout: tutorial
  id: snake
---
### Snake
En este primer tutorial vamos a programar un juego moderadamente simple, "Snake". El objetivo del juego es mover una serpiente
por el tablero para comerse las manzanas que van apareciendo. El juego termina si la cabeza de la serpiente toca alguna parte
del cuerpo de la misma.

Tenemos dos variantes del juego; en una el tablero es infinito, lo que significa que si salimos por un extremo apareceremos por
el extremo contrario; en la otra el tablero está limitado en sus extremos, con lo que si chocamos con los mismos el juego acaba.

Este es el resultado final:

<div class="game_example">
  <script type="application/javascript" src="assets/game-08.js"></script>
  <canvas id="canvas" width="700" height="350" style="background:#999">[Canvas not supported by your browser.]</canvas>
</div>

Divertido ¿verdad?, comencemos a desarrollar el juego...
