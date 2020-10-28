---
  layout: tutorial
  id: snake
---

# Optimizaciones de Javascript

Aunque durante este tutorial hemos estado usando el lenguaje Javascript los conceptos estudiados son independientes del lenguaje
usado, con lo que puedes cambiar a cualquier otro lenguaje para desarrollar videojuegos. Nosotros seguiremos, no obstante, usando
Javascript en nuestros tutoriales.

Javascript es un lenguaje interpretado muy antiguo. Creado por Netscape, una empresa ya desaparecida, en 1995 para dotar a su
navegador web, Nestcape Communicator, de capacidades dinámicas para la creación de contenido web. Los desarrolladores de sitios
web podían, mediante el uso de Javascript, modificar algunas partes del contenido y de la interacción con el usuario sin necesidad
de contactar con un servidor remoto, consiguiendo de esta manera más fluidez en sus páginas web. Actualmente es un dialecto del
estándard ECMAscript y la versión 6 es la más extendida y la que aportó mayores cambios y correcciones para simplificar y reducir
el número de errores que se generaben debido a sus evoluciones durante su larga vida.

En esta sección vamos a realizar una serie de cambios en el código que aprovechan todas las ventajas de las versiones modernas
de Javascript. El [la página principal de este sitio]({{ "/#references" | relative_url }}) tienes disponibles enlaces a información
más detallada.

## Encapsulación de código

Una de las principales características de Javascript es que todos los scripts son globales, esto quiere decir que comparten el
scope (el ámbito en el que se definen nombres del programa), con lo que un script podría sobreescribir el valor de una variable
o una función de otro script provocando fallos de muy difícil detección. Inicialmente Javascript sólo tenía dos scopes, global y
de función, con la versión 6 del estándard aprece un scope nuevo que es el de bloque (entre las llaves de instrucciones compuestas
como if y for).

La solución al problema de la reescritura ha sido (y es todavía, porque no veremos los módulos) encerrar el código del script
dentro de una función, para proteger los nombres propios y evitar sobreescribir los globales. El problema es que el scope de una
función comienza en el momento en que se ejecuta, así que debemos crear la función (dándole un nombre, lo que ya interfiere en el
ámbito global) y luego ejecutarla. Afortunadamente Javascript provee de las funciones autoejecutables (self-executing functions
or IIFE, Immediately-Invoked Function Expression) lo que nos permite definir y ejecutar una función en un único paso y sin darle
un nombre (función anónima, como la que usamos para la gestión de las teclas). Para ello encerramos todo el código de nuestro
juego entre estas dos líneas:

``` javascript
  (function (window, document, undefined) {
    Our code here ...
  }(window, document));
```

De esta manera protegemos nuestros nombres definidos de manera global (fuera de cualquier función) y no sobreescribimos las de
otros posibles scripts con los que podemos convivir. Nuestro código podrá seguir usando nombres globales si es necesario.

Podrás ver que la función que hemos definido declara tres argumentos, pero sólo recibe dos parámetros en la invocación (`window`
y `document` son los principales objetos globales en el navegador). Puede que no parezca tener sentido, pero hay un motivo para
ello: Como sabemos los nombres definidos en una función (igual da que sean variables o nombres de argumentos) sobrescriben a las
existentes en el ámbito global con el mismo nombre, de esta manera estamos creando una copia local en nuestra función de los tres
nombres que definimos como argumentos (`undefined` en Javascript es una variable sin valor definido, pero alguien podría asignarle
uno), así si alguien los modifica nosotros no nos vemos afectados; al pasar como parámetros en la invocación los objetos globales
tenemos una copia de los objetos globales, pero sin embargo `undefined` tiene el valor "*no definido*" que cabría esperar.

## Modo estricto

La evolución de Javascript ha ido sustituyendo prácticas antiguas que han ido cayendo en desuso, pero al mismo tiempo ha tenido
que mantener compatibilidad con las mismas para no romper desarrollos ya existentes. Los navegadores no tienen manera de saber
si el codigo que les proporcionamos usan esas antiguas prácticas o no salvo que lo indiquemos, este es el propósito del *"modo
estricto"*. Para activarlo debemos poner el string `"use strict";` al principio del script o de una función y entonces el navegador
desactivará esas prácticas antiguas en el scope correspondiente sólamente. Al desactivarlas si nuestro codigo contiene alguna de
esas viejas prácticas dejará de funcionar y aparecerán los correspondientes errores en la consola del navegador. Activemos el modo
estricto en nuestra función y veamos que pasa.

¡Oooops!..., nuestro juego se ha roto. Como puedes ver todos los errores hacen referencia a que hay variables sin definir.

Esto es debido a una vieja práctica, antiguamente las variavbles se podian usar sin definir. Para definir una variable se usaba
la palabra reservada `var`, al hacer uso de ella la variable se definía en el scope correspondiente (dentro de función o global),
pero si no se usaba `var`, automáticamente la variable se definía en el scope global, aunque se estuviera dentro de una función;
esto ha sido motivo de innumerables errores. Con la versión 6 se sustituyó `var` por `let` y `const`, lo que hace que en *"modo
estricto"* aparezca un error al no definir las variables o al modificar una variable definida con `const`. Todavía queda permitido
el uso de `var`, pero se desaconseja su uso por los motivos ya mencionados.

Para poder eliminar todos los errores debes usar let en la definición de las variables contador de todos los bucles `for`, es
decir, sustituir `for (i = 0;` por `for (let i = 0;` (Este error ha sido algo premeditado para resolverlo en este punto).

## Verificar recursos multimedia

En nuestro juego usamos varios recursos multimedia (imágenes y audio), en el caso de las imágenes usamos una comparación contra
`null` para decidir si tenemos pintamos la imagen o si usamos un color. Esto no es del todo correcto, ya que se pueden producir
errores en la comunicación que impidan la descarga o no haberse descargado completamente el recurso en el momento de querer usarlo.

En el caso de las imágenes la mejor manera de Verificar si el recurso está disponible es preguntar por la propiedad `Image.width`,
si es mayor que `0` significa que la imagen está completa. Debemos cambiar el código del método `draw` por:

``` javascript
  this.draw = function (ctx, bkgImg) {
    if (ctx == null) {
      window.console.warn('Missing parameters on function draw');
    } else {
      if (bkgImg != null && bkgImg.width > 0) {
        ctx.drawImage(bkgImg, this.x, this.y)
      } else {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    }
  };
```

En el caso del audio la verificación consistiría en validar la siguiente condición `(audio != null && audio.readyState >= HAVE_CURRENT_DATA)`.

## Compatibilidad de audio

Distintos navegadores tienen distintas capacidades y soportan distintos formatos de archivos multimedia, por ejemplo *Internet
Explorer* y *Safari* solo admiten formato mp3 y mp4 (m4a/aac), así que es una buena práctica incluir estas validaciones para que
nuestro código sea compatible con todos los navegadores. Para que esto sea manejable se suelen definir funciones que hacen la
validación y desde el código se llama a estas funciones para evitar contaminar el código. Definimos entonces una función con la
validación que se encargará de incializar correctamente los objetos en función de los formatos soportados y llamamos a esta
función desde `init`:

``` javascript
function initCompatibleAudio() {
  if ((new Audio()).canPlayType('audio/ogg') != '') {
    eat.src = "assets/eat.oga";
    over.src = "assets/over.oga";
  } else {
    eat.src = "assets/eat.m4a";
    over.src = "assets/over.m4a";
  }
}
```

## Comparadores estrictos

Javascript permite hacer comparaciones entre valores equivalentes que no sean estrictamente idénticos (haciendo conversiones de
manera automática), esto dotó de versatilidad durante mucho tiempo para el desarrollo web, pero ha causado conflictos cuando se
requiere comparar dos valores que sean exactamente iguales. Para resolver este conflicto, Javascript agregó dos nuevos comparadores
para asegurar la estricta igualdad o diferencia de dos valores, agregando un caracter extra de igualdad al final de la comparación.
Para saber más acerca de la equivalencia de valores con operadores no estrictos puedes consultar la [siguiente tabla](http://dorey.github.io/JavaScript-Equality-Table/).

Para evitar posibles conflictos en el código la recomendación es usar siempre los comparadores estrictos salvo que se busque
alguna característica de los no estrictos, como comparación con null o 0 para obtener falso, p.ej.

## Undefined versus null

En Javascript `undefined` es toda variable que ha sido declarada pero a la que no se le ha asignado valor, mientras que `null` es
un valor que se puede asignar a una variable para indicar que está *"vacia"*. Javascript nunca asigna el valor `null` a una variable.

Por tanto ambas son de tipos distintos (*undefined* y *object*) y si usamos un comparador estricto el resultado será `false`,
mientras que con un comparador tradicional será `true`.

Cabe destacar que `undefined`, más allá de un concepto es una variable, a la que se le puede asignar un valor, cuando comparamos cualquier variable con `undefined` estamos comparando los valores de esa variable y de la variable `undefined`. Si asignamos otro valor a `undefined`, empezarán a pasar cosas extrañas en los programas.

## Uso de prototipos

JavaScript no posee *"clases"*, al menos no como las entendemos en los lenguajes orientados a objetos tradicionales (como Java,
C++, ...), sólo tiene objetos, que son una agrupación de atributos y funciones definidos mediante una función *"constructor"*
(como nuestra `Rectangle`). A partir de la versión 6 Javascript ya dispone de una sintaxis que simula las clases, pero sigue
manteniendo el mismo mecanismo de objetos basado en *"prototipos"*, la veremos con más detalle en una sección posterior.

En Javascript todo objeto tiene una propiedad (su *[[Prototype]]*) que comparte con todas las instancias de ese objeto y a la
que podemos acceder mediante el atributo `prototype`. `prototype` es, a su vez, un objeto por lo que también tiene un atributo
`prototype` lo que permite implementar una jerarquía de herencia. En la cabeza de esta jerarquía esta `Object` cuyo *"prototipo"*
es null.

En las secciones anteriores hemos implementado nuestro objeto `Rectangle` asignando las funciones a atributos en la función
constructora, este método tiene un problema, ya que cada objeto creado tiene una copia propia de cada función, lo que incrementa
considerablemente el consumo de recursos (memoria RAM en este caso). Este problema puede solucionarse mediante el uso de los
*"prototipos"*, al ser compartido por todas las instancias, si creamos las funciones el él, todas las instancias comparten la
copia de la función.

Para mejorar nuestra implementación de `Rectangle` vamos a usar *"prototipos"*, podemos hacerlo de dos maneras:

Crear las funciones directamente en el *"prototipo"* de `Rectangle`:

``` javascript
  function Rectangle(x, y, color, width, height) {
    this.x = (x == null) ? 0 : x;
    this.y = (y == null) ? 0 : y;
    this.color = (color == null) ? '#ffffff' : color;
    this.width = (width == null) ? 0 : width;
    this.height = (height == null) ? this.width : height;
  }

  Rectangle.prototype.intersects = function (rect) {
    if (rect == null) {
      window.console.warn('Missing parameters on function intersects');
    } else {
      return (this.x < rect.x + rect.width &&
        this.x + this.width > rect.x &&
        this.y < rect.y + rect.height &&
        this.y + this.height > rect.y);
    }
  };

  Rectangle.prototype.draw = function (ctx, bkgImg) {
    if (ctx == null) {
      window.console.warn('Missing parameters on function draw');
    } else {
      if (bkgImg != null && bkgImg.width > 0) {
        ctx.drawImage(bkgImg, this.x, this.y)
      } else {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    }
  };
```

Sobresecribir el *"prototipo"* de `Rectangle` con un nuevo objeto que contenga las funciones (en este caso deberemos incluir
tambien una referencia para el cosntructor)

``` javascript
  function Rectangle(x, y, color, width, height) {
    this.x = (x == null) ? 0 : x;
    this.y = (y == null) ? 0 : y;
    this.color = (color == null) ? '#ffffff' : color;
    this.width = (width == null) ? 0 : width;
    this.height = (height == null) ? this.width : height;
  }

  Rectangle.prototype = {
    constructor: Rectangle,

    intersects: function (rect) {
      if (rect == null) {
        window.console.warn('Missing parameters on function intersects');
      } else {
        return (this.x < rect.x + rect.width &&
          this.x + this.width > rect.x &&
          this.y < rect.y + rect.height &&
          this.y + this.height > rect.y);
      }
    },

    draw: function (ctx, bkgImg) {
      if (ctx == null) {
        window.console.warn('Missing parameters on function draw');
      } else {
        if (bkgImg != null && bkgImg.width > 0) {
          ctx.drawImage(bkgImg, this.x, this.y)
        } else {
          ctx.fillStyle = this.color;
          ctx.fillRect(this.x, this.y, this.width, this.height);
        }
      }
    }
  };
```

En este segundo caso lo que estamos haciendo es sustituir completamente el *[[Prototype]]* y por lo tanto toda la jerarquía de herencia, en caso de haberla. También puedes notar que debemos asignar de nuevo el atributo `constructor` que se generaba automáticamente al definir la función constructor. Este formato es más compacto, pero puede introducir muchos fallos, así que debes ser cauteloso al usarlo.

Para nuestro juego es seguro usarlo.

## Calidad de código con JSLint

[JSLint](http://www.jslint.com/){:target="\_blank"} es una herramienta que pertenece a la familia de los *"linters"*, herramientas orientadas a la verificación de la correción del código y a la recomendación de buenas prácticas para el mismo sea legible y sencillo de comprender. Estos aspectos son especialmente importantes en proyectos grandess o colaborativos, por lo que resulta una buena práctica seguir estas recomendaciones desde el comienzo. Algunas herramientas de desarrollo web, como [Brackets](http://brackets.io/){:target="\_blank"}, ya lo incorporan por defecto.

JSLint puede ser configurado mediante el uso de directrices de configuración escritas como comentarios al inicio del fichero de código, por ejemplo:

``` javascript
/*jslint browser */
```

Otras alternativas son [JSHint](https://jshint.com/){:target="\_blank"} y [ESlint](https://eslint.org/demo){:target="\_blank"}.

## Código final

<div class="game_example">
  <script type="application/javascript" src="assets/game-06.js"></script>
  <canvas id="canvas" width="700" height="350" style="background:#999">[Canvas not supported by your browser.]</canvas>
</div>
<div>&nbsp;</div>

``` javascript
{% include_relative assets/game-06.js %}
```
