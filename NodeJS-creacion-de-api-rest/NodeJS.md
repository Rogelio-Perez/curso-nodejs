# Introduccion, que es una API Rest

Veremos que es una API Rest y como utilizarla con **NodeJS** y utilizando el framework de **express js**.

## Conceptos basicos de API Rest:
- **Cliente:** es el que consume la API Rest.
- **Servidor:** es el que provee la API Rest.
- **Endpoint:** es el punto de entrada de la API Rest.
- **URI:** es la direccion de la API Rest.
- **Metodo:** es el tipo de peticion que se realiza a la API Rest.

La API Rest se encuentra dentro de una nube, un servidor que corre la aplicacion, la nube que es nuestra API se debe conectar con algo que almacene la info, en este caso es un servidor de base de datos. Nosotros utilizaremos **MongoDB**.

El cliente se conecta a la API Rest, la api va a la base de datos y busca la informacion que necesita, se los devuelve a la API rest, y por ultimo la API rest devuelve la informacion al cliente.
#### Cliente => API REST  => Base de datos => API REST => Cliente

El cliente puede ser una aplicacion mobil o una aplicacion web.

## Formas de conectarse.
Para poder conetarnos a nuestra API Rest vamos a utilziar una forma estandar que existe en el mercardo.
| Endpoint| Descripcion |
|------|------|
| **GET/users - /users:id** | Es un metodo que nos permite obtener informacion. Lista un arreglo con los usuarios. Si utilizamos el id nos devuelve un solo usuario y este es un Objeto.|
| **POST/users - /users** | Es un metodo que nos permite crear un usuario. |
| **PUT/users/:id** | Se utiliza para reemplazar un usuario existente.|
| **PATCH/users/:id** | Se utiliza para actualizar un usuario existente parcialmente. |
| **DELETE/users/:id** | Se utiliza para eliminar un usuario existente.|

Sabiendo esto, ya podemos comenzar a creear nuestra API Rest.

# Inicializando el proyecto.
Debemos crear una carpeta donde guardaremose el proyecto en este caso la carpeta se llama **_api_**
Debemos encontrarnos en nuestra carpeta de api, ahi ejecutaremos el comando de `npm init -y` para inicializar nuestro proyecto, `-y` es para aceptar todo lo que se va a instalar.

Se crear un archivo llamado _package.json_.

```json
{
  "name": "api",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```
Podemos cambiar el nombre del autor con nuestro nombre.
Luego creamos un archivo llamado `api.js`.
Debemos intalar unas dependencias para utilizar este archivo, el comando es, `npm install -S express`. Luego de la instalacion se crea un archivo llamado _package-lock.json_. Ahi aparecera todas las dependencias que se instalaron. Este archivo es importante, este busca las versiones que tenemos, y al momento de instalarlos estos utilizaran las versiones que tenemos guardados.
Se crea una nueva opcion llamada, "dependencies".

```json
"dependencies": {
    "express": "^4.17.3"
  }
```

# Creando la API

Vamos a comenzar
```javascript
const express = require('express')
```
`require` nos sirve para importar un modulo, en este caso express.
Lo siguiente que necesitamos para inicializar una aplicacion en express es que ejecutemos la funcion de `express`
```javascript
const express = require('express')
const app = express()
```
Debemos indicar en que puerto queremos que ejecute
```javascript
const express = require('express')
const app = express()
const PORT = 3000
```
Vamos a hacer una app sencilla, `en app.get()` le debemos pasar un string este string es para indicarle a express cual es la ruta del navegador para que se ejecute la funcion en el segundo argumento.
```javascript
const express = require('express')
const app = express()
const PORT = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})
```
| Abreviacion | Significado |
|:------:|:------:|
|**req**| Request|
|**res**| Response|

En request(req) es donde viene toda la peticion de un cliente.
En response(res) es para enviarle cosas al usuario como por ejemplo, el mas comun de todos `rest.send()`, con este podemos enviarle cosas al usuario.
Debemos reiniciar nuestra APP, cada que hagamos un cambio, para que esto sea automatico lo veremos mas adelante.

```javascript
app.get('/', (req, res) => {
  res.status(200).send('Chanchito Feliz!')
})
```

`.status()` nos permite indicarle al cliente si es que la respuesta tuvo exito, y si viene un dato acompañado de esta, en este caso, el dato es `'Chnchito Feliz!'`.

Podemos llamar a `.status()` y a `.send()` en el mismo app.get().
Ahora debemos ejecutar nuestra app para que escuche en el puerto 3000.
Esto se hace con `app.listen()`, le pasamos el puerto, y una funcion, que esta se ejecute cuando la app este corriendo con exito.

```javascript
app.listen(port, () => {
  console.log(`Arrancando la aplicacion en el puerto: ${port}!`)
})
```

Guardamos, y en nuestra terminal escribimos lo siguiente `node api.js`. En nuestro navegador web, nos dirigimos a **localhost:** seguido de la ruta que hemos puesto, en este caso **3000**. `localhost:3000`.

Nos va a devolver el string que decidimos devolder.

# Agregando endpoint POST

Un endpoint es una ruta a la cual tu puedes llegar atraves de una peticio.

en este caso utilizaremos `.post()`, con la misma ruta.

```javascript
app.post('/', (req,res) =>[
  res.status(200).send('Creando chanchito')
])
```

El primer endpoint que creamos fue utilizando el metodo `.get()`, el metodo de `.get()`, nos prmite ingresar a esa ruta escribiendola atraves de la url, sin embargo, ahora la creamos con `.post()`, nosotros no podemos acceder utilizando la ruta en el url, para llegar a esa ruta se utiliza **Postman**, o atraves de la terminal.
Nosotros utilizaremos **Postman**, porque es mas sencillo.

Si te diste cuenta en este caso, pusimos el `.status(201)` en 201, nosotros utilizamos **200**, cuando este todo Ok, y ademas queramos devolver datos al cliente(un arreglo, un objeto, string, etc.), en este caso **201**, igual significa Ok, pero ademas significa _creado_, y aqui no es necesario devolver datos al cliente. **204**, igual es Ok, pero ademas significa, _No Content_, osea no devolver absolutamente nada, 204 tambien lo utilizaremos para PUT, PATCH, DELETE.

|Status Code|Descripcion|
|:------:|------|
|200 | Ok, y enviaremos mas Datos.|
|201 | Ok, creado, y no enviaremos mas datos.|
|204 | Ok, No Content, y no enviaremos mas datos.|

Dentro de Postman pondremos la ruta que queremos llamar, en este caso **http://localhost:3000/**, y veremos la respuesta que nos devuelve. Si hacmeos una peticion en **GET** veremos que nos devuelve _Chanchito Feliz!_, pero si enviamos la peticion en **POST**, nos devolvera _Creando Chanchito_.

# Agrgando PUT, PATH y DELETE

Ahora continuaremos agregando los demas endpoints a nuestra aplicacion, en este caso PUT, PATCH y DELETE.
Vamos a comenzar escibiendo `.put()`
```javascript
app.put('/:id', (req, res) => {
  res.sendStatus(204)
})
```
El `'/:id` que aparece, quiere decir que este va a ser un dato variable, pero que va a aparecer en la ruta, nosotros podemos acceder a la ruta, enviando **PUT**, pero en la raiz debemos pasarle el **id**, puede ser _1, 2, afc234ad, razvi etc._ Lo importante es que siga con la estrucutra:
**/string**, y verbo de **PUT**.

El `.sendStatus()` quiere decir que solo enviaremos el estado, este caso el estado, o el codigo de estado es de **204**.
Hacemos esto mismo para PATH y DELETE.

```javascript
app.put('/:id', (req, res) => {
  res.sendStatus(204)
})

app.patch('/:id', (req, res) => {
  res.sendStatus(204)
})

app.delete('/:id', (req,res) => {
  res.sendStatus(204)
})
```

Si se fijan **204** aparece en **PUT, PATCH y DELETE**, entonces como sabemos a que endpoint llamamos, esto lo sabemos cuando nosotros realizemos una peticion porque llamarecmos a `fetch()`, dentro debemos pasarle un valor de `method:` y dentro le pasamos **POST, PUT, PATCH o DELETE**.

```javascript
fetch('http://localhost:3000/1', {
  method: 'POST' // or 'PUT, PATH, DELETE'' 
})
```

Independientemente de lo que nos devuelve nosotros vamos a saber que endpoint estamos llamando cuando lo indiquemos en nuestro codigo de **JavaScript** en la parte del cliente.

Cuando hacemos la peticion en **Postman** este no nos mostara nada pero veremos **204 No Content**, eso quiere decir que esta funcionando. Esto nos ocurrira con los demas endpoints.

Algo que seria interesante es poder obtener el valor de /:id y hacer algo con ese valor, para poder hacerlo escribiremos `req` esto nos mostrara algo gigante, pero veremos que podemos obtener en el objeto.

```javascript
app.put('/:id', (req, res) => {
  console.log(req)
  res.sendStatus(204)
})
```
Cuando probemos esto en **Postman** veremos en nuestra cosola todo lo el objeto de `req`, ahi podremos ver el methodo con el cual lo estamos llamando, y muchas mas cosas, pero lo que a nosotros nos interesa es el de `params`, que es un objeto, y dentro de este objeto podemos acceder a los datos que nosotros queremos, en este caso el id.

```
params: { id: '1' }
```
Pero para acortar todo esto, pondremos `req.params`

```javascript
app.put('/:id', (req, res) => {
  console.log(req.params)
  res.sendStatus(204)
})
```
Ahora solo vermos `{ id: 'lala' }`, cambiaremos lala por 23, asi que tendremos `{ id: '23' }` en nuestra consola. Nosotros vamos a poder obtener estos id y obtener datos en la base de datos, dependiendo del verbo PUT, PATCH o DELETE. Vamos a hacer lo mismo para **GET**.

```javascript
app.get('/:id', (req, res) => {
  console.log(req.params)
  res.status(200).send(req.params)
})
```
En Postman enviaremos la peticion desde **GET** y veremos que en la parte de abajo, tendremos un objeto con el id y su valor.

```json
{
  "id": "23"
}
```

De esta manera podemos crear una ruta que va a ser estandar y que va a realizar las acciones, de Listar, Crear, Actualizar, Eliminar, etc.

# Refactorizando los endpoint
Vamos a limpiar nuestro codigo, y vamos a hacer un refactor, para que sea mas legible y que sea mas facil de entender. En este momento tenemos pocas lineas de codigo, pero despues se convertira mas largo y dificl de mantener, nosotros vamos a crear un nuevo modulo, crearemos un nuevo archivo llamnado user.controller.js y moveremos la logica de los handlers a este archivo.
Dentro del archivo, crearemos una constante llamada **User**, porque esa va a gestionar los usuarios
```javascript
const User = {
  get: (req,res) => {
    res.status(200).send('Este es un Chanchito')
  },
  list: (req, res) => {
    res.status(200).send('Hola Chanchito')
  },
  create: (req, res) => { 
    res.status(201).send('Creando Chanchito')
  },
  update: (req, res) => {
    res.status(204).send('Actualizando Chanchito')
  },
  destroy: (req, res) => {
    res.status(204).send('Eliminando un Chanchito :(')
  }
}

module.exports = User
```
| **Verbo** | **Endpoint** | **Accion** |
| :---: | :---: | --- |
|get| GET/:id |porque ahi vamos a listar a un solo usuario|
|list| GET |porque ahi vamos a listar a los usuarios|
|create| POST |porque ahi vamos a crear a los usuarios|
|update| PUT/PATCH |porque ahi vamos a actualizar a los usuarios|
|destroy| DELETE |porque ahi vamos a eliminar a los usuarios|

Finalmente exportmaos esta objeto de usuario con `module.exports`

```javascript
module.exports = User
```
Cuando lo importemos, vmaos a recibir por defecto lo que hemos exportado, entonces cuando lo importemos, vamos a recibir el objeto qde Usuario que hemos exportado. Estas funciones las pasaremos a cada uno de nuestros endpoints y asi se limpiara bastante nuestro codigo.

Nos devolvemos a api.js, y debemos importar User, lo haremos creando una constante, y requiriendo el archivo que hemos creado

```javascript
const user = require('./user.controller')
```

Seguido de esto cambiaremos nuestras funciones, lo haremos de la siguiente manera

```javascript
//Antes
app.get('/', (req, res) => {
  res.status(200).send('Chanchito Feliz!')
})

//Despues
app.get('/', user.list)
```
Y asi haremos con todos

```javascript
app.get('/', user.list)
app.post('/', user.create)
app.get('/:id', user.get)
app.put('/:id', user.update)
app.patch('/:id',user.update)
app.delete('/:id',user.destroy)
```

# Capturando todas las peticiones
Vamos a ver el manejo de todas las rutas que nosotros no tengamos definidas, esto sirve para mostrar una pagina de error, y que nosotros podamos personalizarlo.

Dentro de `api.js` es agregar al **final** de todas las rutas, **siempre debe ser al final**

```javascript
app.get('*', (req, res) => {
  res.status(404).send('Esta Pagina No Existe')
})
```

**'*'** Quiere decir que manejes todas las rutas que no esten definidas
Si probamos esto en **Postman** colocando una ruta que no existe en **GET** veremos que nos devuelve un error 404, pero si lo intentamos en **POST** no nos mostrara el error. Entonces debemos hacer lo mismo para **POST**.

```javascript
app.post('*', (req, res) => {
  res.status(404).send('Esta Pagina No Existe')
})
```
Esto no hace sentido con **POST** porque es algo que debe existir, pero si hace sentido con **GET**, porque el user pudo haber escrito algo mal.

# Final
Has llegado al final de esta seccion, te invito a investigar un poco mas de los codigos de respuest HTTP en esta pagina puedes encontrar mas informacion: [Respuestas HTTP](https://developer.mozilla.org/es/docs/Web/HTTP/Status, 'Respuestas HTTP')

Tambien te invito a practicar lo que hemos visto hasta ahora y si es necesario darle un repaso.

## Codigo final
`api.js`
```javascript
const express = require('express')
const user = require('./user.controller')
const app = express()
const port = 3000

app.get('/', user.list)
app.post('/', user.create)
app.get('/:id', user.get)
app.put('/:id', user.update)
app.patch('/:id', user.update)
app.delete('/:id', user.destroy)

app.get('*', (req, res) => {
  res.status(404).send('Esta Pagina No Existe')
})

app.post('*', (req, res) => {
  res.status(404).send('Esta Pagina No Existe')
})

app.listen(port, () => {
  console.log('Arrancando la aplicacion')
})

```
`user.controller.js`
```javascript
const User = {
  get: (req, res) => {
    res.status(200).send('Este es un Chanchito')
  },
  list: (req, res) => {
    res.status(200).send('Hola Chanchito')
  },
  create: (req, res) => {
    res.status(201).send('Creando Chanchito')
  },
  update: (req, res) => {
    res.status(204).send('Actualizando Chanchito')
  },
  destroy: (req, res) => {
    res.status(204).send('Eliminando un Chanchito :(')
  },
}

module.exports = User
```