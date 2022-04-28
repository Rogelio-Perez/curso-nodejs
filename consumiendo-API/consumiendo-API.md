# Sirviendo archivos

Comenzaremos en el archivo de `api.js`, cuando ingresemos a la raiz `'/'` con el verbo de `get`, nos entrege un archivo `HTML` donde podamos cargar los archivos de **JavaScript**. Vamos a cambiar las rutas, por algo que tenga mas sentido.

```javascript
app.get('/users', user.list)
app.post('/users', user.create)
app.get('/users/:id', user.get)
app.put('/users/:id', user.update)
app.patch('/users/:id', user.update)
app.delete('/users/:id', user.destroy)
```

Una ves hecho esto, vamos anecesitar agregar nuestra ruta de raiz en la cual devolveremos un archivo `html`. Creamos una nueva ruta, de la raiz, y esta ves le pasamos a `res` un nuevo metodo llamado `.sendFile()`, lo que vamoa a hacer es enviarle un archivo `HTML` al usuario.

Vamos a necesitar indicar donde se encuentra utilizando `__dirname` este le va a indicar a `.sendFile()` donde nos ubicamos, agregamos un `console.log(__dirname)`, para nosotros poder verlo. 

Despues de `__dirname` le pasamos el nombre del archivo que queremos que se envie, en este caso `/index.hmtl`, y podremos correr nuestro servidor.

```javascript
app.get('/', (req,res) => {
  res.sendFile(`${__dirname}/index.html`)
})
```

Cuando nosotros corramos el servidor, nos va a mostrar un error, esto es debido a que nosotros aun no creamos el archivo `index.html`. Pero podemos ver lo que contiene `__dirname`, por lo tanto `__dirname` nos dice en que carpeta se esta ejecutando el script `api.js`

```
Error: ENOENT: no such file or directory, stat 'C:\Users\razvi\curso\api\index.html'
```

Si despues ejecutamos otro script, nos va a indicar esa carpeta, ahora vamos a agregar un archivo `index.html`.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="main.js"></script>
  <title>NodeJS</title>
</head>
<body>
  <h1>Hola Mundo</h1>
</body>
</html>
```
Ahora volvemos a ejecutar nuevamente el servidor. Y veremos el texto de Hola Mundo. Esto quiere decir que estamos devolviendo de manera correcta nuestro archivo `index.html`.

Cambiaremos el texto de **hola mundo** por `mi web`.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="main.js"></script>
  <title>NodeJS</title>
</head>
<body>
  <h1>mi web</h1>
</body>
</html>
```

Como puedes ver hemos agregado un script `main.js`.
```html
<script src="main.js"></script>
```
Pero como estamos trabajando con express debemos indicarle que este archivo existe, si corremos nuestro servidor, veremos `mi web`, pero si abrimos la consola del navegador, nos indicara que el archivo `main.js` no existe.
```
GET http://localhost:3000/main.js net::ERR_ABORTED 404 (Not Found)
```

Vamos a ir a `Network`, refrescamos la pagina, y vemos que esta tratando de cargar el archivo `main.js` que no existe para eso vamos a hacer lo siguiente.

La forma de hacerlo es utilizar un middleware, que tiene **express**.
```javascript
app.use(express.static)
```
Con `.static()` le decimos a express que busque en una carpeta, todos los archivos que se encuentren dentro de este (js, html, css, etc), todo lo que se encuentre vamos a servirlo en base a su extencion, `lala.js => /lala.js`

A `.static()` es un metodo al cual le pasamos un **string**, que es el nombre de la carpeta, el que se utiliza mucho es el de `'client'`, pero nosotros le pondremos `app`.
```javascript
app.use(express.static('app'))
```
Dentro de app, agregaremos un archivo `main.js`, dentro de `main.js` escribiremos lo siguiente. 

```javascript
console.log('chanchito feliz')
```

Esto es para verificar que todas las lineas que escribimos estan de manera correcta, debemos corres nuestro `api.js`.

Ahora en la consola del navegador, vamos a ver que nos devuelve `chanchito feliz`.

Ya que hemos configurado nuestra aplicacion para que nos devuelva un archivo `html`, ahora construiremos nuestra aplicacion.

# Cargando plantilla y formulario.

Lo primero que haremos es agregar nuestra plantilla principal, agregar un titulo, un formulario y funcionalidades. En nuestro archivo `index.html` borramos `mi web` y dejamos la estructura.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="main.js"></script>
  <title>NodeJS</title>
</head>
<body>
  
</body>
</html>
```
En `main.js` vamos a eliminar el `console.log('chanchito feliz')`. Para que nosotros podamos ejecutar el archivo javascript, una ves que se termine de cargar la plantilla `html` se pasa `window.onload` `window` hace referencia a la ventana del navegador, y `.onload` es la funcion que se ejecuta cuando carge todo el contenido de la ventana. Pero la vamos a ir separando en una funciones.

```javascript
const loadInitialTemplate = () => {
  const template = `
    <h1>Usuarios</h1>
    <form id="user-form">
      <div>
        <label>Nombre</label>
        <input type="text" name="name">
      </div>
      <div>
        <label>Apellido</label>
        <input type="text" name="lastname">
      </div>
      <button type="submit">Enviar</button>
    </form>
    <ul id='user-list'></ul>
  `
}

window.onload = () => {
 loadInitialTemplate() 
}
```

Una ves terminado la plantilla, vamos a adjuntar este `html`, dentro de el nodo de `body`. Dentro de la funcion `loadInitialTemplate()` vamos a agregar lo siguiente.

```javascript
const body = document.getElementsByTagName('body')[0]
body.innerHTML = template
```
La parte de `document.getElementsByTagName('body')[0]` es para que nos devuelva el primer elemento de la etiqueta `body`, ya que estenos devuelve un arreglo, y dentro de `body.innerHTML` le decimos que le asigne el contenido de `template`. 
Ejecutamos nuevamente el servidor.

Veremos como se agrega todo el `html`

El siguiente paso, es agregarle un evento al formulario, para que este haga algo, lo vamos a buscar con su propiedad `id` y luego de que tengamos la referencia del formulario, utilizaremos la propiedad de `onsubmit()`, le agregaremos una funcion para que haga un llamado a la API que creamos y cree un usuario.

Llamamos la funcion luego de que se halla cargado el `html`

```javascript
window.onload = () => {
 loadInitialTemplate() 
 addFormListener()
}
```
Y despues creamos la funcion de `addFormListener()` despues de `loadInitialTemplate()`.

```javascript
const addFormListener = () => {
  const userForm = document.getElementById('user-form')
  userForm.onsubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(userForm)
    const data = Object.fromEntries(formData)
    
  }
}
```
Nosotros llamamos el formulario por su `id`, luego le pasamos un listener de `.onsubmit()`, y creamos una funcion asincrona que recive el evento.
`e.preventDefault()` es para que no se recargue la pagina, y `formData` es para que nos devuelva un objeto con todos los datos que se encuentran en el formulario. Ahora llamamos a `Object.fromEntries(formData)` para que nos devuelva un objeto con todos los datos que se encuentran en el formulario, osea nos devuelve un `json`. 

# Creando usuarios.

Ya que obtenemos los datos, se lo envimaos a la API, para que esta cree un usuario en la base de datos de `Mongo`, debemos utilizar `await` ya que nos devuelve una promesa, utilizamos `fetch('/users')` para idicar el lugar donde queremos crear el usuario, y le pasamos una configuracion muy parecida a **Postman**.

```javascript
const addFormListener = () => {
  const userForm = document.getElementById('user-form')
  userForm.onsubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(userForm)
    const data = Object.fromEntries(formData)
    await fetch('/users', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    }) 
    userForm.reset()
    getUsers()
  }
}
```
`userForm.reset()` es para que el formulario se limpie despues de que se haya creado el usuario.

Ahora nos falta ir a buscar los usuarios a la base de datos, y pintarlos. Vamos a crear la funcion de `getUsers()` con los usuarios encontrados, pero antes, intentaremos crear un usuario.
En **Network** vemos como se a hecho la peticion.

Ahora buscaremos los usuarios a nuestra API con la funcion de `getUsers()`, y los pintaremos en el `html`, dentro de la lista no ordenada.

# Listanado usuarios.

```javascript
const getUsers = async () => {
  const response = await fetch('/users')
  const users = await response.json()
  console.log(users)
}
```
Hacemos la peticion con `fetch()` y la respuesta la debemos transformar en un `json` seguido de esto debemos ver en la consola si es que ha encontrado los usuarios. Pero ademas de llamar nuestra funcion de `getUsers()` en la parte de `addFormListener()`, vamos a llamarla en la parte de `window.onload()`.

```javascript
window.onload = () => {
 loadInitialTemplate() 
 addFormListener()
 getUsers()
}
```
Ahora si podemos refrescar la pagina, si es que todo salio bien, podemos ver en la consola veremos un listado de los usuarios creados, en un arreglo. Vamos a eliminar los anteriormente creados. Nos iremos a [MongoDB Atlas](https://www.mongodb.com/atlas/database, 'MongoDB Atlas'), dentro de nuestro panel iremos a **Browse Collections**, veremos el nombre de la base de datos que se llama **miapp** y una coleccion llamada **users**, y ahi veremos todo lo que hemos metido, para eliminar los anteriores, basta con que pinchemos en el bote de basura y luego en delete. 

Ahora volvemos a hacer el llamado y solo veremos el dato que hemos metido, nos devolvemos a `getUsers()` y eliminamos el `console.log()`, y crearemos la plantilla para imprimir los usuarios.

```javascript
const getUsers = async () => {
  const response = await fetch('/users')
  const users = await response.json()
  const template = user => `
    <li>
      ${user.name} ${user.lastname} <button data-id="${user._id}">Eliminar</button>
    </li>
  `

  const userList = document.getElementById('user-list')
  userList.innerHTML = users.map(user => template(user)).join('')
}
```
Ponemos `data-id` para que tenga el `id` del elemento que vamos a eliminar.

# Eliminando usuarios.
Vamos a eliminar todos los usuarios creados, para esto es luego de que hallamos imprimido todos los usuarios, debemos ir manualmente a cada uno de los botones, y agregar un listener para agregar el comportamiento de eliminar usuarios.

```javascript
users.forEach(user => {
    const userNode = document.querySelector(`[data-id="${user._id}"]`)
    userNode.onclick = async e => {
      await fetch(`/users/${user._id}`, {
        method: 'DELETE',  
      })
      userNode.parentNode.remove()
      alert('Usuario Eliminado')
    }
  })
```
Hacemos un `.forEach()`, para asignarle el `listener` a todos los botones, 
llamamos el boton por medio de el selectro custmo que utilizamos, es necesario poner los selectores custom en corchetes `[]`, y utilizando template string, seguido de esto hacemos un `fetch()` para que se elimine el usuario, pasandole el id, y al final asignamso `userNode.parentNode.remove()` para que se elimine el usuario, si no ponemos `.parentNode` solo eliminara el boton, y no el usuario.

Asi podemos crear un conjunto de `html` que incluya `javascript` y agregar las funcionalidades que nosotros queramos.

# Final
Has llegado al final de esta seccion, te invito a que puedas seguir profundizando y aplicando lo aprendido en esta seccion, y que te diviertas con el aprendizaje. Puedes crear nuevas aplicaciones, o agregar un estilo css a tu aplicacion, o crear una nueva funcionalidad a tu aplicacion.

## Codigo final

`main.js`
```javascript
const loadInitialTemplate = () => {
  const template = `
    <h1>Usuarios</h1>
    <form id="user-form">
      <div>
        <label>Nombre</label>
        <input type="text" name="name">
      </div>
      <div>
        <label>Apellido</label>
        <input type="text" name="lastname">
      </div>
      <button type="submit">Enviar</button>
    </form>
    <ul id='user-list'></ul>
  `
  const body = document.getElementsByTagName('body')[0]
  body.innerHTML = template
}

const getUsers = async () => {
  const response = await fetch('/users')
  const users = await response.json()
  const template = user => `
    <li>
      ${user.name} ${user.lastname} <button data-id="${user._id}">Eliminar</button>
    </li>
  `

  const userList = document.getElementById('user-list')
  userList.innerHTML = users.map(user => template(user)).join('')
  users.forEach(user => {
    const userNode = document.querySelector(`[data-id="${user._id}"]`)
    userNode.onclick = async e => {
      await fetch(`/users/${user._id}`, {
        method: 'DELETE',  
      })
      userNode.parentNode.remove()
      alert('Usuario Eliminado')
    }
  })
}

const addFormListener = () => {
  const userForm = document.getElementById('user-form')
  userForm.onsubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(userForm)
    const data = Object.fromEntries(formData)
    await fetch('/users', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    }) 
    userForm.reset()
    getUsers()
  }
}

window.onload = () => {
 loadInitialTemplate() 
 addFormListener()
 getUsers()
}
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

app.get('/users', user.list)
app.post('/users', user.create)
app.get('/users/:id', user.get)
app.put('/users/:id', user.update)
app.patch('/users/:id', user.update)
app.delete('/users/:id', user.destroy)

app.use(express.static('app'))
app.get('/', (req,res) => {
  console.log(__dirname)
  res.sendFile(`${__dirname}/index.html`)
})
app.get('*', (req, res) => {
  res.status(404).send('Esta Pagina No Existe')
})

app.post('*', (req, res) => {
  res.status(404).send('Esta Pagina No Existe')
})

app.listen(port, () => {
  console.log('Arrancando la aplicacion en el puerto ' + port)
})

```
`index.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="main.js"></script>
  <title>NodeJS</title>
</head>
<body>
  
</body>
</html>
```