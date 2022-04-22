# Que es MongoDB ?

Es una base de datos orientada a documentos, un documento es un objeto json, que son similares a los objetos de javascript `"prop": valor`.

### De que se compone?
| Componente | Descripción |
| --- | --- |
|**Colecciones**| Una coleccion es un grupo de documentos. Una coleccion podria ser User, que tiene un listado de documentos, que estos van a ser usuarios, los documentos no es necesario que tenga un esquema.|
| **Documentos**| Un documento es un objeto json, que son similares a los objetos de javascript `"prop": valor`.|
| **Esquemas**| Un esquema es una definicion de un documento, que define los campos que tiene el documento. Lo utilizaremos con una libreria que se llama `mongoose`|
| **Indices**| Un indice es una lista de documentos, que se puede usar para buscar documentos.|

### Alternativas de MongoDB
- Community Server
- Enterprise Server
- Atlas (Esta utilizaremos)

MongoDB Atlas es una base de datos de alta disponibilidad, que permite a los desarrolladores crear sus propias colecciones y documentos, es completamente gratis.

# Creando un cluster en la nube.
Nosotros como vimos antes vamos a utilizar [MongDB Atlas](https://www.mongodb.com/atlas, 'MongoDB Atlas'), debes crearte una cuenta e iniciar secion.
Dentro del panel de administracion, veremos un boton gigante que diga _Build a Database_, que significa construir una base de datos. Lo pinchamos y esto nos llevara paso a paso para crear una base de datos ne la nube, nos mostrara distintos paquetes que podemos seleccionar, pero nosotros utilizaremos la **FREE**. Nos mostrara unas cuantas opciones, en **Cloud Provider**, vamos a saleccionar **AWS**, seguido seleccionaremos la zona mas cercana que tengamos, puede ser Europa, Asia, America, Asia Pacific, etc. Igual podemos cambiar el nombre del **Cluster** por defecto es **Cluster 0** yo lo dejare asi, pero pueden escoger el que quieran. Finalmente damos click en **Create Cluster**.

Seguido de esto nos pedira crear un **usuario** con **password** para que este gestione la base de datos, por lo tanto debes acordarte de tu **usuario** y **password**. Como este es un ambiente de pruebas el **user** y **password** pueden no ser tan comlejos, en mi caso le pondre **user: roge-node, password: roge123**, terminando le damos lcick en **Create User**.

Bajaremos y podemos indicar las IP o maquinas que se pueden conectar a la base de datos, como este es un ambiente de pruebas, le pondre la opcion de publica que es **0.0.0.0/0**, pero en un ambiente de produccion podemos poner las IP de las maquinas que se conecten a la base de datos. Si vas a cambiar a produccion debes quitar la opcion de publica.

Damos click en Finish and Close.

Para conectarnos debemos dar click en **Conect**, nos data 3 opciones:

- Connect with the MongoDB Shell.
- Connect your application.
- Connect using MongoDB Compass.

Nosotros utilizaremos **Connect your application**, nos entregara una url
```
mongodb+srv://<username>:<password>@cluster0.vkoww.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
```
Para poder conectarnos a nuestra base de datos, donde aparece **&lt;username&gt;**, debemos cambiarlo por el **user** que acabamos de crear, en mi caso **roge-node**, y donde dice **&lt;password&gt;**, debemos cambiarlo por el **password** que acabamos de crear, en mi caso **roge123**.
Debemos guardar la URL que nos entrego para poder conectarnos, teniendo esto, pasaremos a conectar nuestra aplicacion con la base de datos.

# Creando modelos y guardando datos
En nuestra carpeta de **api**, vamos a instalar una dependencia que se llama **mongoose**, es una libreria que nos va a ayudar a conectarnos a nuestra base de datos en la nube.
```javascript
npm i -S moongose
```
Una ves instalada vamos a crear un nuevo archivo, el cual se va a llamar `index.js`, dentro crearemos una constante de mongoose.
```javascript
const mongoose = require('mongoose');
```
Luego nos conectaremos a nuestra base de datos que se encuentra en la nube, debemos escribir lo siguiente, llamamos a `mongoose` y luego al metodo de `connect()`, y luego pegaremos en comillas simples la URL que nos entrego en el paso anterior.
```javascript
mongoose.connect('mongodb+srv://roge-node:roge123@cluster0.vkoww.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
``` 
La parte de la URL que dice **myFirstDatabase**, es el nombre de nuestra base de datos, si lo queremos cambiar, ahi es donde debemos cambiarlo, yo la cambiare, y se llamara **miapp**.
```javascript
mongoose.connect('mongodb+srv://roge-node:roge123@cluster0.vkoww.mongodb.net/miapp?retryWrites=true&w=majority')
``` 
Y ya nos hemos conectado a una base de datos en mongoDB Atlas, es bastante facil.
Ahora nos falta diseñar nuestros modelos de bases de datos, un modelo es la definicion de como queremos que se ve la base de datos. Por ejemplo, **nombre** debe ser de tipo **string**, la **edad** debe ser de tipo **number**, etc.

En este caso nuestro modelo va a ser el de Usuario
```javascript
const User = mongoose.model('User', {
  username: String,
  edad: Number,
})
```
model es una funcion que necesita **2 argumentos**, **el nombre del modelo**, y **el segundo la forma que van a tener lo objetos que vamos a guardar dentro de user**, deben tener una forma de json.

Los modelos se escriben con mayuscula, pero cuando vas a crear una instancia de un modelo, debes ponerlo en minuscula, por ejemplo: `const User` del modelo, y `const user` de la instancia.

En nuestro caso, nuestro modelo se llama User.

Luego vamos a crear una funcion asincrona que nos permita crear a los usuarios
```javascript
const crear = async () => {
  const user = new User({ username: 'chanchito feliz',edad: 15 })
  const savedUser = await user.save()
  console.log(savedUser)
}

crear()
```
creamos la constante de user y le pasamos la nueva instancia de User, y debemos indicar cuales van a ser los datos que este tendra, en este caso, el username y la edad, ahora es indicarle que lo queremos guardar, y la forma mas facil de hacerlo es con `user.save()`, este retorna uina promesa asi que podemos utilizar `.then()` y `.catch()` para manejar los errores, pero mejor utilizaremos `await` y se lo asignamos a una constante llamada `savedUser` para poder mostrar el usuario en la terminal.

Finalmete ejecutamos la funcion de crear y ejecutamos el archivo de index.js, y nos mostrara en la terminal el usuario que acabamos de crear. Puede que tarde un poco debido a que se esta conectando a la nube, pero finalmete nos devuelve el usuario que acabamos de crear.
```json
{
  username: 'chanchito feliz',
  edad: 15,
  _id: new ObjectId("6262e33910dd0de04780cd27"),
  __v: 0
}
```
nos devuelve todas las propiedades que tenia nuestro objeto, pero nos devuelve una nueva la cual es el **_id**, el **_id** es el identificador unico que acabamos de crear en la base de datos. El **_id** nos va a servir para ver si un usuario esta escribiendo algun producto, o si esta escribiendo alguna categoria, etc.

# Buscar, actualizar y eliminar
Lo siguiente que vamos a hacer es como podemos buscar absolutamente todo lo que se encuentra dentro de una collecion, pero para ello debemos tener mas usuarios, asi que crearemos a **chanchito triste** con **25 años**. Y ejecutamos el script.

```javascript
const crear = async () => {
  const user = new User({ username: 'chanchito triste',edad: 25 })
  const savedUser = await user.save()
  console.log(savedUser)
}

crear()
```
Con esto podemos con la funcionalidad de buscar todo, comentamos la parte de `//crear()` y crearemos una nueva funcion asincrona llamada buscarTodo.
```javascript
const buscarTodo = async () => {
  const users = await User.find()
  console.log(users)
}

buscarTodo()
```
creamos una constante llamada users que es el resultado de una promesa, llamamos `User.find()` esta va a ir a buscar todo lo que se encuentra dentro de esa coleccion, esta nos devuelve un arreglo con todos los usuarios que se encuentran en la coleccion.
```json
[
  {
    _id: new ObjectId("6262e33910dd0de04780cd27"),
    username: 'chanchito feliz',
    edad: 15,
    __v: 0
  },
  {
    _id: new ObjectId("6262e48c61ef34407eeb5a7b"),
    username: 'chanchito triste',
    edad: 25,
    __v: 0
  }
]
```
Ahora tomaremos el nombre de usuario y en base a su nombre buscaremos un recurso en la base de datos, para eso comenta la parte de `//buscarTodo()` y creamos una nueva funcion asincrona llamada buscar.
```javascript
const buscar = async () => {
  const user = await User.find({ username: 'chanchito feliz' })
  console.log(user)
}

buscar()
```
Ahora en find le pasamos el objeto del nombre que queremos buscar, este nos devuelve un arreglo con el usuario que se encuentra en la base de datos.
```json
[
  {
    _id: new ObjectId("6262e33910dd0de04780cd27"),
    username: 'chanchito feliz',
    edad: 15,
    __v: 0
  }
]
```
`find()` lo que hace, es buscar todos los elementos que cumplan con la funcion que le pasamos, para que siempre nos retorne solo uno, devemos utilizar el metodo `.findOne()`
Comentamos nuevamente la parte de `//buscar()` y creamos una nueva funcion asincrona llamada buscarUno.
```javascript
const buscarUno = async () => {
  const user = await User.findOne({ username: 'chanchito feliz' })
  console.log(user)
}

buscarUno()
```
En este caso le pasamos las mismas condiciones de busqueda, solo que `find()`, nos va a devolver un arreglo `[]`, y `findOne()` nos devuelve un objeto `{}`, esto siempre y cuando lo encuentre, si no lo encuentra, devuelve `null`
| **find()** | **findOne()** |
| :-: | :-: |
| `[]` | `{}` |

Si ejecutamos el script, nos devolvera un objeto con el nombre que le pusimos que buscara.
```json
{
  _id: new ObjectId("6262e33910dd0de04780cd27"),
  username: 'chanchito feliz',
  edad: 15,
  __v: 0
}
```
---
Comenta la parte de `//buscarUno()` y creamos una nueva funcion asincrona llamada actualizar. Como podemos hacer para actualizar un recurso.
```javascript
const actualizar = async () => {
  const user = await User.findOne({ username: 'chanchito feliz' })
  console.log(user)
  user.edad = 30
  await user.save()
}

actualizar()
```
Para nosotros poder actualizar un recurso, debemos primero buscarlo, luego modificarlo y luego guardarlo. Todos los `user` tienen el metodo de `.save()`.

---

Ahora veremos la funcionalidad de eliminar un recurso.
Para eso vamos a crear una nueva funcion asincrona llamada eliminar.
```javascript
const eliminar = async () => {
  const user = await User.findOne({ username: 'chanchito triste' })
  await user.remove()
}

eliminar()
```
Nuevamente primero debemos buscar el usuario que queremos eliminar. Para poder eliminar un recurso, debemos llamar a await porque devuelve una promesa, llamamos a **user** y al metodo de **.remove()** este nos permite eliminar el mismo recurso de la base de datos, solo lo podemos llamar simepre y cuando exista. Si ejecutamos el metodo **.remove()** cuando no existe un recurso, nos va a devolver un error. 
```
  await user.remove()
             ^

TypeError: Cannot read properties of null (reading 'remove')
    at eliminar (C:\Users\perez\Documents\PROGRAMACION\cursos\nodejs\api\index.js:50:14)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
```

Para poder solucionar esto, debemos utilizar una validacion con un `if`.
```javascript
const eliminar = async () => {
  const user = await User.findOne({ username: 'chanchito triste' })
  console.log(user)
  if (user) {
    await user.remove()
  }
}

eliminar()
```
Ahora si ejecutamos el script, nos devolvera null, porque no ha encontrado al usuario que queremos eliminar.
```json
null
```
---
Ahora que sabemos todo esto, vamos a ir a nuestro documento de la API y poder implementar todo esto que hemos visto. Para asi actualizar nuestros endpoints, y que estos hagan algo, y no solo envien codigo HTTP, si no que efectuen acciones.

# Empezando a actualizar nuestra API
Vamos a continuar actualizando la API para que esta haga mas cosas, vamos a copiar la linea de `mongoose.connect()`
```javascript
mongoose.connect(
  'mongodb+srv://roge-node:roge123@cluster0.vkoww.mongodb.net/miapp?retryWrites=true&w=majority'
)
```
Y la pegamos en `api.js` debemos importar `mongoose` y despuesd el puerto pegamos la linea copiada.

```javascript
const express = require('express')
const mongoose = require('mongoose')
const user = require('./user.controller')
const app = express()
const port = 3000

mongoose.connect(
  'mongodb+srv://roge-node:roge123@cluster0.vkoww.mongodb.net/miapp?retryWrites=true&w=majority'
)
```
Ahora debemos definir nuestro modelo de usuario. Creamos un nuevo archivo llamado `User.js`.
```javascript
const mongoose = require('mongoose')

const Users = mongoose.model('User', {
  name: { type: String, required: true, minLength: 3 },
  lastname: { type: String, required: true, minLength: 3 },
})

module.exports = Users
```
Ahora hemos colocado unos objetos, para asi poder meter mas requerimientos.
| **Propiedad** | **Descripcion** |
| :-: | :-: |
| type | Tipo de dato que debe tener |
| required | Si es requerido o no |
| minLength | Longitud minima |

Finalmente exportamos el objeto con `module.exports`.

Ahora nos iremos al archivo de `user.controller.js` y vamos a importar `Users`
```javascript
const Users = require('./User')
```
Ahora podemos utilizar esto en nuestros endpoint, pero debemos ponerle `async` a todas las funciones ya que estamos utilizando `await`
```javascript
const User = {
  get: async (req, res) => {
    res.status(200).send('Este es un Chanchito')
  },
  list: async (req, res) => {
    const users = await Users.find()
    res.status(200).send(users)
  },
  create: async (req, res) => {
    res.status(201).send('Creando Chanchito')
  },
  update: async (req, res) => {
    res.status(204).send('Actualizando Chanchito')
  },
  destroy: async (req, res) => {
    res.status(204).send('Eliminando un Chanchito :(')
  },
}
```
Ahora en la parte de list, podremos listar los usuarios, que tengamos en la base de datos, por eso los mandamos a llamar y los guardamos en una constante llamada `users`.
```javascript
list: async (req, res) => {
    const users = await Users.find()
    res.status(200).send(users)
  },
```
Si ahora hacemos la peticion de `GET` en **Postman**, nos va a devolver una lista de usuarios.
```json
[
    {
        "_id": "6262e33910dd0de04780cd27",
        "username": "chanchito feliz",
        "edad": 30,
        "__v": 0
    }
]
```
---
Ahora podemos continuar con el resto de nuestros endpoints.
Para nosotros crear un usuario, utiliando **POST** debemos poder leer el `req.body`, para esto dbemos irnos a nuestro archivo de `api.js` y ahi crearemos un middleware, un middleware es una funcion que se ejecuta cuando nosotros realicemos cualquier tipo de peticion en nuestr aplicacion, osea simepre se ejecuta, regularmente se utilizan para hacer validadciones, en este caso es para sacar los datos que vienen de **POST**, e inyectarlos en la propiedad de `body` en nuestro objeto `request`.
```javascript
create: async (req, res) => {
    console.log(req.body)
    res.status(201).send('Creando Chanchito')
  }
```
Para hacer esto, despues de nuestro puerto, vamos a colocar lo siguiente.
```javascript
app.use(express.json())
```
Esto lo que hace es tomar todas las peticiones que vengan en un objeto json, las va a transformar en un objeto jasvascript, y lo va a guardar en la propiedad `body` del objeto `request`.

Para esto en **Postman**, nos vamos a ir a la parte de `Body`, seleccionarmos `raw`, y luego debemos escribir el objeto json que queremos enviar.
```json
{
    "name": "Mikasa",
    "lastname": "Ackerman"
}
```
Pero igual debemos poner la cabezera, asi que vamos a `Headers`, y debemos poner `Content-Type` y `application/json`, enviamos la peticion en `POST` y vermos en la consola el objeto enviado, porque hemos colocado un `console.log` del `req.body`.

```javascript
create: async (req, res) => {
    console.log(req.body)
    res.status(201).send('Creando Chanchito')
  }
```
# Buscar uno y crear
Vamor a la funcion de create, y ya sabemos que el objeto viene a traves del **req.body**.

```javascript
create: async (req, res) => {
    console.log(req.body)
    const user = new Users(req.body)
    const savedUser = await user.save()
    res.status(201).send(savedUser._id)
  },
```
Le pasmos todo el req.body a nuestra instancia de Users, guardamos el usuairo en una constante llamada `savedUser` y luego mandamos el id del usuario a la respuesta.

Si probamos esto en **Postman**, nos va a devolver un objeto con el id del usuario.
```json
"6262f29763b095e545ca46bf"
```
Porque esto es lo que le estamos mandando al cliente, el ID lo puede utilizar el cliente, para asignarselo al usuario.

---

Ahora continuamos con la funcion de get, en este caso el id, lo obtendremos de los params, con destucting, vamos a obtener el id del usuario, y lo guardamos en una constante llamada `id`.

```javascript
get: async (req, res) => {
    const { id } = req.params
    const user = await Users.findOne({ _id: id })
    res.status(200).send(user)
  },
```
Lo que hacemos es pasarle el id del usuario a la funcion de `findOne`, para buscar un `id` en Mongo, los id simepre estan con un `_`, y lo guardamos en una constante llamada `user`.
Si hacemos esta peticion en **Postman**, debemos pasarle algun Id que tengamos en mi caso le paso el ultimo que me dio, y como respuesta tengo todo el objeto del usuario.
```json
{
    "_id": "6262f29763b095e545ca46bf",
    "name": "Mikasa",
    "lastname": "Ackerman",
    "__v": 0
}
```
Asi podemos ir a buscar los recursos uno a uno

# Actualizar y eliminar
Ahora vamos a continuar con los endpoints de `update` lo que haremos es tomar los datos que vengan de la peticion, vamos a ir a buscar le recurso a actualizar, y los datos uqe vienen en la peticion, reemplazar losd atos del usuario, y luego utilizar `.save()` y renviar un 204, que significa que todo esta bien.

```javascript
update: async (req, res) => {
    const { id } = req.params
    const user = await Users.findOne({ _id: id })
    Object.assign(user, req.body)
    await user.save()
    res.sendStatus(204)
  },
```
Lo que hacemos es tomar el id del usuario, buscarlo en la base de datos, y luego reemplazar los datos del usuario con los datos que vienen en la peticion, esto se hace con `Object.assing()`, donde el primer argumento, es nuestro objeticvo al cual le vamos a reemplazar las coas, y el siguiente es lo nuevo que va a tener que es la peticion desde el cliente, y luego utilizar `.save()` y renviar un 204, que significa que todo esta bien.

Probamos esto en **Postman**, ponienod el metodo de `PUT` no olvides poner en la URL el id del usuario que quieres cmabiar, y el body lo nuevo a cambiar, al enviar la peticion, veremos que no retorna nada, solo un 204 que significa que todo esta bien. Ahora lo puedes buscar en `GET` y veras que el usuario se actualizo.

Si quieres solo camibar el nombre, solo ponemos el nombre en el body, y en la respuesta, veremos que el nombre se actualizo.

```json
{
    "name": "Levi"
}
```

---

Ahora veremos la ultima funcin que es la de `destroy`, esto es mas sencillo, y funciona similar a las otras, solo que no olvides validar, si el usuario existe, y si no existe, mandar un 404.

```javascript
destroy: async (req, res) => {
    const { id } = req.params
    const user = await Users.findOne({ _id: id })
    if(user) {
      user.remove()
    }
    res.sendStatus(204)
  },
```

Ahora si probras esto en **Postman**, veremos que no retorna nada, solo un 204 que significa que todo esta bien. Y si buscamos ese usuario, no nos devolvera nada, porque ya no existe, pero si devuelve un 200.

Asi hemos logrado actualizar nuestra API, para pueda, eliminar, actualizar y borrar usuarios. Ahora crearemos una aplicacion que pueda consumir una API.

# Final

Has llegado al final, de esta, seccion, te invito a crees tus propias API, para que puedas practicar aun mas, te dare algunos ejemplos para que te puedas comenzar a crear tu propia API.
- Peliculas
- Usuarios
- Comentarios
- Videojuegos
- Tareas
- etc.

De momento para practicar, solo puedes mandar textos y asi, te invito igual a profundiar mas en MongoDB, para que aprendas como guardar mas datos, y de que forma.

## Codigo final
`user.controller.js`
```javascript
const Users = require('./User')

const User = {
  get: async (req, res) => {
    const { id } = req.params
    const user = await Users.findOne({ _id: id })
    res.status(200).send(user)
  },
  list: async (req, res) => {
    const users = await Users.find()
    res.status(200).send(users)
  },
  create: async (req, res) => {
    const user = new Users(req.body)
    const savedUser = await user.save()
    res.status(201).send(savedUser._id)
  },
  update: async (req, res) => {
    const { id } = req.params
    const user = await Users.findOne({ _id: id })
    Object.assign(user, req.body)
    await user.save()
    res.sendStatus(204)
  },
  destroy: async (req, res) => {
    const { id } = req.params
    const user = await Users.findOne({ _id: id })
    if (user) {
      user.remove()
    }
    res.sendStatus(204)
  },
}

module.exports = User
```
`User.js`
```javascript
const mongoose = require('mongoose')

const Users = mongoose.model('User', {
  name: { type: String, required: true, minLength: 3 },
  lastname: { type: String, required: true, minLength: 3 },
})

module.exports = Users
```
`api.js`
```javascript
const express = require('express')
const mongoose = require('mongoose')
const user = require('./user.controller')
const app = express()
const port = 3000

app.use(express.json())

mongoose.connect(
  'mongodb+srv://roge-node:roge123@cluster0.vkoww.mongodb.net/miapp?retryWrites=true&w=majority'
)

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
`index.js`
```javascript
const mongoose = require('mongoose')
mongoose.connect(
  'mongodb+srv://roge-node:roge123@cluster0.vkoww.mongodb.net/miapp?retryWrites=true&w=majority'
)

const User = mongoose.model('User', {
  username: String,
  edad: Number,
})

const crear = async () => {
  const user = new User({ username: 'chanchito triste', edad: 25 })
  const savedUser = await user.save()
  console.log(savedUser)
}

//crear()

const buscarTodo = async () => {
  const users = await User.find()
  console.log(users)
}

//buscarTodo()

const buscar = async () => {
  const user = await User.find({ username: 'chanchito feliz' })
  console.log(user)
}

//buscar()

const buscarUno = async () => {
  const user = await User.findOne({ username: 'chanchito feliz' })
  console.log(user)
}

//buscarUno()

const actualizar = async () => {
  const user = await User.findOne({ username: 'chanchito feliz' })
  console.log(user)
  user.edad = 30
  await user.save()
}

//actualizar()

const eliminar = async () => {
  const user = await User.findOne({ username: 'chanchito triste' })
  console.log(user)
  if (user) {
    await user.remove()
  }
}

eliminar()
```