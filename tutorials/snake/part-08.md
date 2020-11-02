---
  layout: tutorial
  id: snake
---

## Programación orientada a objetos

En programación se llama *"clase"* a una *"plantilla"* a partir de la cual se pueden crear objetos, esta plantilla define cuales
son los atributos (conjunto de valores que identifican a cada objeto) y los métodos (funciones que permiten interactuar con el
objeto) que tendrán los objetos creados a partir de ella. Los *"objetos"* son cada una de las instancias, creadas a partir de una
clase, que existen en un programa y con los que se puede interactuar.

La herencia es una característica de las clases que nos permite definir nuevas clases en base a otra ya existente; de esta manera
la nueva clase "hereda" los atributos y métodos de la clase original y puede sobreescribirlos si así lo desea.

Como hemos dicho anteriormente en este tutorial Javascript no tiene el concepto de *"clase"*, sólo el de objeto y, para gestionar
de manera eficiente los recursos, usa un mecanismo denominado *"prototipo"* que, además, permite implementar la herencia y que ha
sido lo que hemos usado nosotros para desarrollar nuestro juego.

A partir de la versión 6 Javascript soporta una sintaxis que añade al lenguaje el concepto de *"clase"*, pero es sólo eso, una
sintaxis, ya que por debajo el mecanismo es el mismo que anteriormente. Veamos como se define nuestro objeto `Rectangle` usando
la nueva sintaxis:

``` javascript
class Rectangle {
  constructor(x, y, color, width, height) {
    this.x = (x == null) ? 0 : x;
    this.y = (y == null) ? 0 : y;
    this.color = (color == null) ? '#ffffff' : color;
    this.width = (width == null) ? 0 : width;
    this.height = (height == null) ? this.width : height;
  }

  intersects(rect) {
    if (rect == null) {
      window.console.warn('Missing parameters on function intersects');
    } else {
      return (this.x < rect.x + rect.width &&
        this.x + this.width > rect.x &&
        this.y < rect.y + rect.height &&
        this.y + this.height > rect.y);
    }
  }

  draw(ctx) {
    if (ctx == null) {
      window.console.warn('Missing parameters on function draw');
    } else {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}
```

Como podemos observar ahora todo el código queda declarado dentro de un bloque en el que damos nombre a la clase (antiguamente
el nombre de la clase era el de la función). `constructor` es el método (debe llamarse exactamente de esa manera) que se invoca
para crear objetos de la clase (nuestra antigua función `Rectangle`) y los métodos se definen dentro del bloque de la clase sin
usar la palabra reservada `function`. Todo mucho más limpio y claro.

Una cosa muy importante a tener en cuenta es que las declaraciones de clase deben efectuarse antes de que se referencien en el
código, de no hacerlo asi se producirán errores al ejecutar el código.

También es posible definir atributos y métodos estáticos, estos se pueden usar sin necesidad de crear objetos de esa clase y por
tanto no pueden acceder a atributos o métodos no estáticos. En Javascript los métodos estáticos sólo se pueden llamar usando el
nombre de la clase, veamos un ejemplo:

``` javascript
class Test {
  constructor() {
    this.val = 1;
  }

  printVal() { window.console.log("Value: " + this.val); }

  static invalidVal = -1;
  static printInvalidVal() { window.console.log("Value: " + Test.invalidVal); }
}

let t = new Test();

t.printVal();           // Escribe 1 en la consola.
t.printInvalidVal();    // Error.
Test.printInvalidVal(); // Escribe -1 en la consola.
```

Por último vamos a ver como se usa la herencia en la nueva sintaxis. Con la sintaxis antigua para heredar se añadia el *"prototipo"*
de la clase de la que queríamos heredar en la cadena de *"prototipos"* de la nueva clase. Con la nueva sintaxis simplemente usamos
la palabra reservada `extends` y el nombre de la clase de la que queremos heredar después del nombre de nuestra clase, e invocamos
al constructor de la clase en nuestro propio constructor mediante `super` para heredar sus atributos.

`super` es un *alias* que nos permite hacer referencia a la clase padre, y podemos usarlo en otros métodos para llamar a métodos
de la clase padre. De esta manera podemos sobreescribir los métodos de la clase de la que heredamos manteniendo su funcionalidad
si lo necesitamos.

En nuestro programa, cuando introdujimos las imágenes, modificamos el método `draw` para añadirle un parámetro adicional con la
imagen a dibujar, y si la imagen no estaba lista usábamos el color del objeto. Ahora podemos usar la herencia para crear una
nueva clase `SpriteRectangle`, añadiendo muy poco código y que dejará todo autocontenido y más claro:


``` javascript
class SpriteRectangle extends Rectangle {
  constructor(x, y, color, sprite, width, height) {
    super(x, y, color, width, height);
    this.bkgImg = sprite;
  }

  draw(ctx) {
    if (ctx != null) {
      if (this.bkgImg != null && bkgImg.width > 0)
        ctx.drawImage(this.bkgImg, this.x, this.y)
      else
        super.draw(ctx)
    }
  }
}
```

### Reescribir el código

Ahora que tenemos claro como gestionar clases y objetos con la nueva sintaxis vamos a modificar nuestro código para hacer un uso
intensivo de objetos. A parte de las clases ya vistas crearemos otras para la comida, la serpiente y el propio juego. No incluiré
todo el código nuevo, salvo los casos que requieran de explicaciónes adicionales, intenta hacerlo por ti mismo siguiendo las
explicaciones y si tienes algún problema puedes verlo en el código final. A cada paso tendrás que revisar todo el código de nuevo.

Al principio de nuestro código dejamos sólo las constantes existentes y añadimos unas nuevas con las URLs relativas de los assets
que estamos usando. Las variables las iremos eliminando según las añadimos a las nuevas clases.

``` javascript
  const ASSET_SNAKE_SECTION = "assets/sect.png",
        ASSET_FOOD = "assets/apple.png",
        ASSET_EAT = ["assets/eat.oga", "assets/eat.m4a"],
        ASSET_OVER = ["assets/over.oga", "assets/over.m4a"];
```

Usamos un array para las rutas de los archivos de audio para simplificar el cálculo de nuestra vieja función `initCompatibleAudio`
cuando la integremos en su nueva clase.

A continuación vienen las definiciones de nuestras clases básicas, `Rectangle` y `SpriteRectangle`, tal y como los hemos visto
anteriormente. Modificamos el código para reemplazar los objetos `Rectangle` por los `ImageRectangle` y eliminamos el segundo
argumento en las llamadas al método `draw`.

Añadimos una nueva clase para representar la comida en el juego, `Food`, esta clase extiende a `SpriteRectangle` sólo tiene un
método, `relocate`, que nos servirá para recolocar la comida en el tablero, recibe dos parámetros con el ancho y alto del lienzo
y usa la función `random` para calcular las nuevas coordenadas. El constructor es el mismo que el de. Sustituye el código antiguo
por el nuevo usando usando la clase.

Ahora viene la clase para la serpiente, `Snake`, casi todo el código es el mismo que antes, sólo hay que adaptarlo para introducirlo
dentro de una clase, vamos a ver sus métodos:

- Su constructor recibe la posición inicial, alto y ancho, el color y el sprite a usar para dibujar, el cuerpo. Tiene un atributo
para cada uno de los últimos cuatro valores, que son los que necesitaremos durante la vida del juego, más un vector para el
cuerpo, al final llama al método `reborn` para posicionar la serpiente.
- `reborn` coloca las secciones del cuerpo al principio del juego, recibe las coordenadas de la cabeza y la dirección inicial, el
código es equivalente al antiguo, pero usamos un bucle porque ahora la dirección es variable.
- `draw` contiene el mismo código de pintado ya existente.
- `move` contiene el código de movimiento del cuerpo (el mismo), la cabeza y el control de límites. Como parámetros necesitamos
la distancia que queremos mover, la dirección y las dimensiones del lienzo.
- `hasBitten` devuelve `true` si el cuerpo ha chocado o `false` en caso contrario. El código existente para la detección de
colisión del cuerpo,
- `hasEaten` devuelve `true` si la cabeza ha chocado con la comida recibida como parámetro o `false` en caso contrario.

Una vez creada la clase debes sustituir el código antiguo por las llamadas a los métodos correspondientes de la clase `Snake`.

Por último la clase `SnakeGame`, esta clase tiene como atributos el resto de variables que quedan y como métodos las funciones
principales del juego. Algunas de estos métodos se definen como *estáticos*, ya que no necesitan de una instancia del juego.
Veámoslas una a una:

- `constructor` recibe como parámetro el lienzo e inicializa sus atributos, carga los assets mediante el método `loadAssets` y
crea una instacia de la serpiente y la comida.
- `getWidth`, `getHeight`, `isPaused` y `isGameover` son métodos auxiliares (llamados *getters* en programación orientada a objetos)
que permiten exponer atributos ocultando la implementación dentro del objeto, si se cambia la implementación no cambia el interfaz
de la clase. Retornan, respectivamente, el ancho y alto del tablero del juego y si este está pausado o finalizado.
- `loadAssets` se encarga de crear los recursos multimedia (antigua `initCompatibleAudio`), para ello crea las variables para las
imágenes y el audio y les asigna las URLs que tenemos definidas como constantes.
``` javascript
    loadAssets() {
      let audioFormat = ((new Audio()).canPlayType('audio/ogg') != '') ? 0 : 1;

      this.sectImg = new Image();
      this.foodImg = new Image();
      this.sectImg.src = ASSET_SNAKE_SECTION;
      this.foodImg.src = ASSET_FOOD;

      this.eat = new Audio(ASSET_EAT[audioFormat]);
      this.over = new Audio(ASSET_OVER[audioFormat]);
    }
```
En el caso del audio expresamos el soporte del navegador para los formatos como un número con valores `0` ó `1` que luego usamos
como índice para seleccionar la URL adecuada.
- `paint`, `actions` y `reset` contienen el mismo código que antes, pero adaptado al nuevo escenario de clases.
- `repaint` y `run` estos métodos, aunque son una copia de las antiguas funciones, merecen un comentario aparte para explicar un
aspecto importante de los objetos en Javascript. Como podrás ver, cuando registramos la siguiente ejecución, no pasamos simplemente
la función sino que llamamos al método `bind` de la clase `Function` de Javascript.
``` javascript
  window.requestAnimationFrame(this.repaint.bind(this));
```
En Javascript, el objeto (el valor de `this`) al que está asociado un método se calcula en tiempo de ejecución y en función del
contexto en el que se llama al método. Cuando pasemos a la función `requestAnimationFrame` un método, esta lo almacena para su
posterior ejecución. Este almacenamiento hace que el contexto de la función cambie y, por tanto, se pierde la referencia al objeto
original, con lo que al ejecutarse posteriormente no tiene acceso a los atributos y métodos del objeto y falla. Para solucionar
esto, antíguamente, en vez de pasar directamente el método se creaba una función auxiliar que contenía el valor del objeto en otra
variable (esto se denomina closure, tienes más información en la home):
``` javascript
  let that = this;
  window.requestAnimationFrame(function() { that.repaint(); });
```
A partir de la versión 5 se añadió a la clase `Function` el método `bind` que simplifica esto. A parte del objeto, permite pasar
más parámetros para la función.
- `keyHandler` este método podría haberse definido como estático (haciendo el atributo `lastPressed` también estático) pero no lo
he hecho porque así refuerza la idea de que su lógica sólo tienen sentido si existe un juego ejecutándose.
- `initialize` la antigua función `init` reconvertida en metodo estático, se encarga de instanciar el juego, registrar el manejador
de las teclas y de iniciar los ciclos de acciones y repintado. En este caso el médodo `keyHandler` es asociado con la instancias
del juego, y no con `this` ya que estamos en un método estático.
- `random` la antigua función reconvertida en metodo estático.

## Código final

<div class="game_example">
  <script type="application/javascript" src="assets/game-08.js"></script>
  <canvas id="canvas" width="700" height="350" style="background:#999">[Canvas not supported by your browser.]</canvas>
</div>
<div>&nbsp;</div>

``` javascript
{% include_relative assets/game-08.js %}
```
