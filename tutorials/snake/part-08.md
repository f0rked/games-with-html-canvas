---
  layout: tutorial
  id: snake
---

# Programación orientada a objetos

En programación se llama *"clase"* a una *"plantilla"* a partir de la cual se pueden crear objetos, esta plantilla define cuales
son los atributos (conjunto de valores que identifican a cada objeto) y los métodos (funciones que permiten interactuar con el
objeto) que luego tendrán los objetos creados a partir de ella. Los *"objetos"* son cada una de las instancias, creadas a partir
de una clase, que existen en un programa y con los que se puede interactuar.

La herencia es una característica de las clases nos permite definir un objeto en base a otro ya existente; de esta manera los
nuevos objetos "heredan" los atributos y métodos del objeto anterior y puede sobreescribirlos si así lo desea.

Como hemos dicho anteriormente en este tutorial Javascript no tiene el concepto de *"clase"*, sólo el de objeto y, para gestionar
de manera eficiente los recursos, usa un mecanismo denominado *"prototipo"* que, además, permite implementar la herencia y que ha
sido lo que hemos usado nosotros para desarrollar nuestro juego.

A partir de la versión 6 Javascript soporta una sintaxis que añade al lenguaje el concepto de *"clase"*, pero es sólo eso, una
sintaxis, ya que por debajo el mecanismo es el mismo que anteriormente. Veamos como podemos implementar nuestro objeto `Rectangle`
usando la nueva sintaxis:

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
para crear objetos de la clase (nuestra antigua función `Rectangle`) y los métodos ya se definen dentro del bloque de la clase.
Todo mucho más limpio y claro.

Una cosa muy importante a tener en cuenta es que las declaraciones de clase deben efectuarse antes de que se puedan crear objetos
de esa clase, de no hacerlo asi se producirán errores en la ejecución del código.

También es posible definir atributos y métodos estáticos, estos se pueden usar sin necesidad de crear objetos de esa clase y por
tanto no pueden acceder a atributos o métodos no estáticos. En Javascript los métodos estáticos sólo se pueden llamar  usando el
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

Por último revisaremos la herencia en la nueva sintaxis. Con la sintaxis antigua la herencia se implementaba añadiendo el *"prototipo"*
de la clase de la que queríamos heredar en la cadena de *"prototipos"* de nuestra nueva clase. Con la nueva sintaxis simplemente
usamos la palabra reservada `extends` y el nombre de la clase de la que queremos heredar después del nombre de nuestra clase, e
invocamos al constructor de la clase en nuestro propio constructor mediante `super`.

`super` es un *alias* que nos permite hacer referencia al nuestra clase padre, y podemos usarlo en otros métodos para llamar a
métodos de la clase padre. Con esta construcción podemos sobreescribir los métodos de la clase de la que heredamos.

En nuestro programa, cuando introdujimos las imágenes, modificamos el método draw para añadirle un parámetro adicional con la
imagen a dibujar, y si la imagen no estaba lista usábamos el color del objeto. Ahora podemos usar la herencia para crear una
nueva clase `ImageRectangle`, añadiendo muy poco código y que dejará todo autocontenido y más claro:


``` javascript
class ImageRectangle extends Rectangle {
  constructor(x, y, color, image, width, height) {
    super(x, y, color, width, height);
    this.bkgImg = image
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

Ahora sólo falta modificar nuestro código para reemplazar los objetos de tipo `Rectangle` por los nuevos de tipo `ImageRectangle`
y eliminar el segundo argumento en las llamadas al método `draw`.

## Código final

<div class="game_example">
  <script type="application/javascript" src="assets/game-08.js"></script>
  <canvas id="canvas" width="700" height="350" style="background:#999">[Canvas not supported by your browser.]</canvas>
</div>
<div>&nbsp;</div>

``` javascript
{% include_relative assets/game-08.js %}
```
