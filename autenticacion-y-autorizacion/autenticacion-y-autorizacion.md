# Autenticacion y Autorizacion

## Autenticacion
Que es autenticacion?, es cuando el servidor reconoce quienes somos y nos entrega una llave.

usuario => explorador (username & password) => servidor (llave) => usuario (llave)

## Autorizacion
El servidor nos va a indicar si tenemos permisos para acceder a un recurso o no.

Ejemplo:

`/users/1`

Si el usuario 1 llama a este endpoint, el va a poder entrar pero si el usuario 3 llama al endpoint, se le va a denegar el acceso. 

La autorizacion es un usuario que intenta acceder a ciertas partes de nuestra aplicacion `/users, /products, /twits` la autorizacion es un muro que se encuentra antes de los recursos, como un firewall, el usuario intenta entrar y el muro es el que le da el acceso o no dependiendo de si tiene permisos o no. Si no puede entrar se le manda un error `403`.

## Consideraciones

| Consideracion | Descripcion |
| :-------------: | ------------- |
| **Robo de bases de datos** | Si nos llegan a robar la base de datos y nosotros tenemos los password en tipo string ellos tendran el acceso. |
| **Encriptar password** | Para que lo del punto anterior no suceda debemos encriptar los password, suponienod que el password es `'123456'` esto lo va atrasformar en un `hash` entonces de `123456` pasaria a ser algo como `afascsa324asdca`, si queremos desencriptarla nos deberia dar el password original  |
| **Encriptar con salt** | Un **Salt** es una cadena de caracterez aleatorea `afascsa324asdca` nosotros queremos creaun un **salt** porque si por alguna razon nos roban la base de datos, y el algortimo que utilizamos para encriptar el password, lo que podri ahacer un hacker es tomar un diccionario, con las contrasenas mas utilizadas a anivel mundial y a todas le va a aplicar el algoritmo, y asi irle haciendo match a cada uno de las contrasenas. Por eso cada que creemos un user vamos a generar un **salt**, y con el **salt** vamos a aplicarle el hash a nuesto password, asi todos los usuarios tendran un **salt** distinto. |
| **JSON web token = Llave** | Es una llave, con esta se la damos al cliente, y este utiliza esta llave para tener al acceso al servidor. |

# Instalando dependencias y creando modelo
Vamos a construir un registro y un inicio de sesion para que funcione con lo que vimos en el tema pasado.

Vamos a crear un proyecto, yo llamare la carpeta `auth` e iniciamos un proyecto con el comando `npm init -y`,y vamos a instalar las siguientes dependencias.
```javascript
npm i -S express mongoose bcrypt jsonwebtoken express-jwt
```
Abriremos editor de texto y crearemos un archivo llamado `index.js`, y escribiremos lo siguiente:

```javascript
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const { expressjwt: jwt } = require('express-jwt')

mongoose.connect('mongodb+srv://roge-node:roge123@cluster0.vkoww.mongodb.net/auth?retryWrites=true&w=majority')

const app = express()

app.use(express.json())

app.listen(3000, () => {
  console.log('Server running on port 3000')
})
```
Vamos a utilizar el mismo Cluster del tema pasado para guardar los datos, solo que ahora le cambie el nombre a la base de datos por `auth`, y con eso ya inicializamos nuestra aplicacion.

Ahora vamos a crear el modelo de usuario que va a tener la estructura de los documentos, y este tendra un salt, crearemos un nuevo archivo llamdo `user.js` en el cual pondremos lo siguiente.

```javascript
const mongoose = require('mongoose')

const User = mongoose.model('User', {
  email: { type: String, required: true},
  password: { type: String, required: true},
  salt: { type: String, required: true},
})

module.exports = User
```

Hasta el momento no hemos visto nada nuevo, todo a sido lo que hemos visto en los temas pasados

# Registrando usuarios.

El primer endpoint que utilizaremos es el de `register` recibiremos un json con el email y password y vamos solo a sacar el email, con el email lo vamos a buscarl a la base de datos, si existe vamos a indicar usuario eciste, si no daremos en crear user.

```javascript
const User = require('./user')

app.post('/register', async (req, res) => {
  const { body } = req
  console.log({ body })
  try {
    const isUser = await User.findOne({ email: body.email })
    if (isUser) {
      return res.status(403).send('Usuario ya existe')
    }
    const salt = await bcrypt.genSalt()
    const hashed = await bcrypt.hash(body.password, salt)
    const user = await User.create({ email: body.email, password: hashed, salt })

    res.send({ _id: user._id })
    
  } catch (err) {
   console.log(err)
   res.status(500).send(err.message)
  }
})
```
No olviden exportar `User` para que pueda ser utilizado en otros archivos.
Utilizamos `try catch` para que si hay un error nos lo muestremos en la consola, y al cliente un status de 500 ya que como esta haciendo la peticion a una base de datos pueden pasar diferentes tipos de errores.
Creamos una constante llamada `isUser` para comprobar si el usuario existe, si existe, si existe enviamos que el usuario ya existe, si no existe creamos un nuevo usuario.

En la parte del password, le debemos pasar el `hashed` porque es el que esta encriptado, y el `salt` porque es el que nos va a ayudar a encriptar el password.

Ahora probaremos este endpoint, corriendo el servidor y abriendo **POSTMAN**, haciendo una peticion  **POST** a `/register`, debemos verificar que los headers son correctos, y que el body es correcto. Este nos devolvera el id del usuario, y en la consola veremos un mensaje parecido a este.

```json
{
    "_id": "627c47e667c7679e7fe68f81"
}
```

```javascript
{ body: { email: 'razvi@razvi.com', password: '123456' } }
```

Nuestro `_id` de igual forma lo debemos encriptar, ahora devolveremos un JSON Web Token (JWT).

# Firmando el JWT
- **JWT = JSON Web Token** | Es una llave, con esta se la damos al cliente, y este utiliza esta llave para tener al acceso al servidor. |
 
Vamos a tomar un objeto el cual tendra la propiedad de **_id** lo vamos a encriptar para que tenga un formato de json web token se la enviaremos la usuario y este usuario debe colocar de manera constante dentro de sus headers, de esta manera cada que el usuario mande una peticion vamos a buscar el json web token.

Debemos enciptar el usuario. Esto lo haremos con una funcion que ya tiene `jwt` que se llama `.sing()`:

```javascript
app.post('/register', async (req, res) => {
  const { body } = req
  console.log({ body })
  try {
    const isUser = await User.findOne({ email: body.email })
    if (isUser) {
      return res.status(403).send('Usuario ya existe')
    }
    const salt = await bcrypt.genSalt()
    const hashed = await bcrypt.hash(body.password, salt)
    const user = await User.create({ email: body.email, password: hashed, salt })
    const signed = jwt.sign({ _id: user._id }, 'mi-string-secreto')
    res.status(201).send(signed)

  } catch (err) {
   console.log(err)
   res.status(500).send(err.message)
  }
})
```
Le indicamos a `jwt.sing()`, que es lo que debe encriptar en este caso es `{ _id: user._id }`, y el segundo parametro es el string secreto.
La parte de `mi-string-secreto` es una cadena de texto que nos va a ayudar a encriptar el token, y este debe ser seguro, no se lo debemos pasar a nadie, esto lo solucionaremos despues.
Esto se lo pasamos a una constante llamada signed y esto se lo devolvemos al cliente.
Entonces siempre que creemos un usuario este va a recibir un json web token, y este va a ser el que nos va a ayudar a acceder a nuestro servidor.

Pero esto nos va a servir de muchas formas, asi que mejor crearemos una funcion llamada `signToken` y a ella le pasamos el _id.

```javascript
const signToken = _id => jsonwebtoken.sign({ _id }, 'mi-string-secreto')

app.post('/register', async (req, res) => {
  const { body } = req
  console.log({ body })
  try {
    const isUser = await User.findOne({ email: body.email })
    if (isUser) {
      return res.status(403).send('Usuario ya existe')
    }
    const salt = await bcrypt.genSalt()
    const hashed = await bcrypt.hash(body.password, salt)
    const user = await User.create({ email: body.email, password: hashed, salt })
    const signed = signToken(user._id)
    res.status(201).send(signed)

  } catch (err) {
   console.log(err)
   res.status(500).send(err.message)
  }
})
```
Ahora probaremos la aplicacion nuevamente. Y nos devolverea un json web token.

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjdjNGI3MDk0MzNkYjZkNTIzNWQ4ODAiLCJpYXQiOjE2NTIzMTI5NDR9.5wxhJwRZ9O4Cyl7p0-qTndnyH6Y4MxMFz_Z1CbAjHrA
```

En este momento no lo vamos a utilizar, porque vamos a contruir nuestro inicion de sesion y ahi tambien tendremos un json web token.

# Iniciando sesion
Crearemos el endpoint de inicio de secio:

```javascript
app.post('/login', async (req, res) => {
  const { body } = req
  try {
    const user = await User.findOne({ email: body.email })
    if (!user) {
      res.status(403).send('Usuario y/o contraseña incorrectos')
    } else {
      const isMatch = await bcrypt.compare(body.password, user.password)
      if (isMatch) {
        const signed = signToken(user._id)
        res.status(200).send(signed)
      } else {
        res.status(403).send('Usuario y/o contraseña incorrectos')
      }
    }

  } catch (error) {
    res.status(500).send(error.message)
  }
})
```
`bycrypt.compare(body.password, user.password)` nos devuelve una promesa es por eso que utilizamos `await`, el primer argumento que recive es el de un password no encriptado, y el segundo argumento es el password encriptado y se lo asignamos a la constante `isMatch`, si esta nos devuelve `true` entonces entonces creamos el json web token y se lo enviamos al cliente, si devuelve `false` entonces nos devuelve un mensaje de error.

Ahora podemos probar nuestra app. Debemos cambiar la ruta, por `/login`. Y este nos devuelve un json web token.

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjdjNGI3MDk0MzNkYjZkNTIzNWQ4ODAiLCJpYXQiOjE2NTIzMTM1OTl9.oIJZxnUoK-6IzPAzqLbuTEEmG66QKJuurt6baEjYs-M
```
Ambos endpoint funcionan a la perfeccion, ahora veremos como implementar la autorixacion para ver si puede o no acceder a un recurso.

# Middlewares en express
Los middlewares los hemos estado viendo en el transcurso de este curso y utilizado, pero no sabemos como funciona.

Vamos a poner un tercer argumento llamado `next` si ejecutamos `next`, `next` ejecuta una segunda funcion, con las mismas caracteristicas de `(req, res, next)`.

```javascript
app.get('/lele', (req, res, next) => { next() }, (req, res, next) => { 
  console.log('lala')
  res.send('ok')
})
```
Vamos a ir a **POSTMA** y hacer una peticion **GET**, a `http://localhost:3000/lele`, nos devolvera un `ok` y en nuestra terminal veremos `lala`, si ahora quitamos `next()`

```javascript
app.get('/lele', (req, res, next) => {}, (req, res, next) => { 
  console.log('lala')
  res.send('ok')
})
```
Si volvemos a hacer la misma peticion, se quedara colgado el servidor, porque no le estamos enviando nada al cliente., si queremos enviar la funcion, debemos poner el middleware `next()`, los middleware se ejecutan de izquierda a derecha, siempre y cuando tengan la funcion de `next()`.

Ahora veamos otro concepto.

```javascript
app.get('/lele', (req, res, next) => {
  req.user = { id: 'lele'}
  next()
}, (req, res, next) => { 
  console.log('lala', req.user)
  res.send('ok')
})
```
Si probamos esto, nos devolvera un `ok` y en la consola veremos 
```
lala { id: 'lele' }
```
Lo que pasa es que `req.user` imprime el objeto de `{ id: 'lele' }`.

Ya que entendimos como funcionan los middlewares, vamos a hacer un middleware que cumpla con eso mismo apoyandonos con `jsonwebtoken` y con `jwt`, asi cuando queramos protejer un endpoint es agregar un middleware antes de toda la logica a implementar para asi ejecutar lo demas.

# Middleware de validacion del JWT

Para validar los JWT atraves de nuestros headers vamos a necesitar la libreria de `express-jwt`, para eso vamosa  crear una funcion llamada `validateJwt` esta se crea apartir de `expressJwt` y le debemos pasar un objeto, debe contener la propiedad  de `secrete` es el string secreto que utilizamos cuando firmamos los JWT, luego indicamos el algoritmo que utilizamos para encriptar los tokens, con la propiedad `algorithms` y le pasamos un array con el nombre del algoritmo.

```javascript
const validateJwt = jwt({ secret: 'mi-string-secreto', algorithms: ['HS256'] })
```

Ahora utilziaremos este middleware y lo pondremos en nuestro endpoint de `lele`.

```javascript
app.get('/lele', validateJwt, (req, res, next) => { 
  console.log('lala', req.auth)
  res.send('ok')
})
```
Y probaremos en **POSTMAN**, debemos iniciar secion, en `localhost:3000/login` con el metodo de **POST** y este nos devolvera el json web token.
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjdjNGI3MDk0MzNkYjZkNTIzNWQ4ODAiLCJpYXQiOjE2NTIzNzkzMDd9.yAT7d9kgfEN8WbVOHAo1IBFSDilKHi9iSX8Ddb-2TaI
```
Lo vamos a copiar, vamos a cambiar el endpoint a `/lele`, vamos a cambiar los **headers**, pondremos **Authorization**, y le pasamos el token que nos devuelve el endpoint de `login`. Ahora todas deben contener la cabecera de autorizacion y el json web token. Debemos poner al inicio del json web token el string `Bearer `, para que sea valido.
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjdjNGI3MDk0MzNkYjZkNTIzNWQ4ODAiLCJpYXQiOjE2NTIzNzkzMDd9.yAT7d9kgfEN8WbVOHAo1IBFSDilKHi9iSX8Ddb-2TaI
```
Y nos devolvera un `ok`, y en nuestra terminal veremmos el id del usuario, y con `iat` que significa `issued at`, nos devuelvemos el momento en el que se creo el token. Y se crea por defecto.

```javascript
lala { _id: '627c4b709433db6d5235d880', iat: 1652379307 }
```
Ahora que tenemos el id, nos devolvemos a crear otro, middleware que se encarga de tomar el id del usuario y asignarlo al objeto de request. Esto es importante porque el usuario puede tener `rol` como `user, admin, guest` y asi poder acceder a los endpoints que le correspondan.

Primero vamos a buscar el usuario y lo asignaremos al objeto de request.

Primero vamos a poner un `try catch` porque estamos llamando a la base de datos, y vamos a buscar el usuario por el id que tengamos. Validamos si no lo encuentra manda un `401` si existe se lo asigna a el objeto de request., y pone `next()`, para que se ejecute la siguiente funcion, si tenemos error, el catch le va a mandar el error a `next(e)`

```javascript
app.get('/lele', validateJwt, async (req, res, next) => { 
  try {
    const user = await User.findById(req.auth._id)
    if(!user) {
      return res.status(401).end()
    }
    req.auth = user
    next()
  } catch (e) {
    next(e)
  }
}, (req, res) => {
  res.send(req.auth)
})
```
Vamos a probarlo en **POSTMAN**, y nos devolvera el usuario completo.

```json
{
    "_id": "627c4b709433db6d5235d880",
    "email": "razvi@razvi.com",
    "password": "$2b$10$n00UCCeTjbF9lgTmepLY8u6d.TwWSE4CijQR/xQRYMPROUfDBxThG",
    "salt": "$2b$10$n00UCCeTjbF9lgTmepLY8u",
    "__v": 0
}
```
Nos devolveremos a la aplicacion, para simplifacarlo.

```javascript
const findAndAssingUser = async (req, res, next) => { 
  try {
    const user = await User.findById(req.auth._id)
    if(!user) {
      return res.status(401).end()
    }
    req.auth = user
    next()
  } catch (e) {
    next(e)
  }
}

app.get('/lele', validateJwt, findAndAssingUser, (req, res) => {
  res.send(req.auth)
})
```
Finalmente esto queda que cuando queramos proteger una ruta, debemos pasarle el middleware de `validateJwt` seguido de esto y el middleware de `findAndAssingUser`, luego, colocamos la logica del endpoint. Pero esto lo podemos simplificar aujn mas, tomado `validateJwt` y `findAndAssingUser` de la aplicacion y hacer que de una manera esos 2 sean un solo middleware, `express` tiene una funcionalidad de que nos devolvera un solo middleware. Esto se hace de la siguiente forma:

```javascript
const isAuthenticated = express.Router().use(validateJwt, findAndAssingUser)

app.get('/lele', isAuthenticated, (req, res) => {
  res.send(req.auth)
})
```
`.use()` es la funcion que nos hace componer los middlewares. Y se lo pasamos al endpoint. Asi el usuatio debe estar autenticado para poder acceder a la ruta. Ahora probaremos la aplicacion. Y vemos que sigue funcionando. puedes probar el error, quitandole algun caracter a tu toke, y asi nos mostrara el mensaje de error.

# Middleware para manejo de errores
Vamos a ver la forma generica para manejar los errores de express. Vamos a enviar una web html, que muestre el error. 

Vamos a agregar de manera ficticia un error, que contenga el mensage de `'nuevo error'`

```javascript
app.get('/lele', isAuthenticated, (req, res) => {
  throw new Error('Nuevo error')
  res.send(req.auth)
})
```
Y vamos a correr nuestro servidor, para ver el error. Y nos deolvera el error, y esto lo vamos a cambiar, la forma de manejar los errores es hacer uso de `app.use()`, estos middlewares reciben 4 parametros `err, req, res, next`

```javascript
app.use((err, req, res, next) => {
  console.error('Mi nuevo error', err.stack)
  next(err)
})

app.use((err, req, res, next) => {
  res.send('Ha ocurrido un error :(')
})
```
Este imprime el error en la consola, y luego le mandamos un string. Vamos a probarlo.

Nos devolvera `Ha ocurrido un error :(`, y en la terminal veremos.
```
Mi nuevo error Error: Nuevo error
    at C:\Users\nodejs\auth\index.js:75:9
    at Layer.handle [as handle_request] (C:\Users\nodejs\auth\node_modules\express\lib\router\layer.js:95:5)
    at Immediate.next (C:\Users\nodejs\auth\node_modules\express\lib\router\route.js:144:13)
    at Immediate._onImmediate (C:\Users\nodejs\auth\node_modules\express\lib\router\index.js:646:15)
    at processImmediate (node:internal/timers:468:21)
```

Esto es el error que nosotros lanzamos, asi quepodemos hacer varias cosas como:

- Tener logs de los errores y asi enviarlos a un servicio aparte
- Devolver un mensaje customizado (HTML, CSS, etc)
- Mandar un email con el error
- Mandar un email con el error a una persona especifica
- Mandar un email con el error a una persona especifica, y mandar un email a otra persona

# Como ocultar el secreto? variables de entorno
En videos pasados vimos como encript `jwt` y pusimos el string dentro de nuestro codigo, ha llegado el momento de sacarl `string` para hcaerlo mas seguro.

```javascript
const validateJwt = jwt({ secret: 'mi-string-secreto', algorithms: ['HS256'] })
```
Primero debes saber que son las variables de entorno, una variable de entorno es una variable que se encuentra corriendo en nuestro sistema operativo, podemos escribir en nuestra terminal (git bash, termux, etc.) `export nombre de la variable` ejemplo:
```
export SECRET='mi-string-secreto'
```
Esto lo que hace es definir una variable de entorno dentro del sistema operativo. para verlas, podemos escribir `env` en la terminal. Haremos lo siguiente:
```javascript
console.log(process.env.SECRET)
```
Y corremos el servidor de nuevo, y veremos `mi-string-secreto`. En el codigo de la aplicacion, podemos usar la variable de entorno, reemplazando `'mi-string-secreto'` por `process.env.SECRET`

```javascript
const validateJwt = jwt({ secret: 'mi-string-secreto', algorithms: ['HS256'] })
const signToken = _id => jsonwebtoken.sign({ _id }, 'mi-string-secreto')

ahora

const validateJwt = jwt({ secret: process.env.SECRET, algorithms: ['HS256'] })
const signToken = _id => jsonwebtoken.sign({ _id }, process.env.SECRET)
```

Asi ocultamos la palabra secreta, esto es dentro de la paguina, cuando lo subamos a produccion de las aplicaciones vamos a utilizar la configuracion de los servicios que vamos a utilizar, esto lo veremos mas adelante.

# Final

Has llegado al final de esta seccion, tu tarea es escribir una aplicacion que permita autenticar usuarios, y que permita crear, editar, eliminar, y listar usuarios. Y que puedas mandar un html cuando aparezca algun error.

## Codigo de la aplicacion

`index.js`

```javascript
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const { expressjwt: jwt } = require('express-jwt')
const User = require('./user')

mongoose.connect(
  'mongodb+srv://roge-node:roge123@cluster0.vkoww.mongodb.net/auth?retryWrites=true&w=majority'
)

const app = express()

app.use(express.json())

console.log(process.env.SECRET)
const validateJwt = jwt({ secret: process.env.SECRET, algorithms: ['HS256'] })
const signToken = (_id) => jsonwebtoken.sign({ _id }, process.env.SECRET)

app.post('/register', async (req, res) => {
  const { body } = req
  console.log({ body })
  try {
    const isUser = await User.findOne({ email: body.email })
    if (isUser) {
      return res.status(403).send('Usuario ya existe')
    }
    const salt = await bcrypt.genSalt()
    const hashed = await bcrypt.hash(body.password, salt)
    const user = await User.create({
      email: body.email,
      password: hashed,
      salt,
    })
    const signed = signToken(user._id)
    res.status(201).send(signed)
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message)
  }
})

app.post('/login', async (req, res) => {
  const { body } = req
  try {
    const user = await User.findOne({ email: body.email })
    if (!user) {
      res.status(403).send('Usuario y/o contraseña incorrectos')
    } else {
      const isMatch = await bcrypt.compare(body.password, user.password)
      if (isMatch) {
        const signed = signToken(user._id)
        res.status(200).send(signed)
      } else {
        res.status(403).send('Usuario y/o contraseña incorrectos')
      }
    }
  } catch (error) {
    res.status(500).send(error.message)
  }
})

const findAndAssingUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth._id)
    if (!user) {
      return res.status(401).end()
    }
    req.auth = user
    next()
  } catch (e) {
    next(e)
  }
}

const isAuthenticated = express.Router().use(validateJwt, findAndAssingUser)

app.get('/lele', isAuthenticated, (req, res) => {
  throw new Error('Nuevo error')
  res.send(req.auth)
})

app.use((err, req, res, next) => {
  console.error('Mi nuevo error', err.stack)
  next(err)
})
app.use((err, req, res, next) => {
  res.send('Ha ocurrido un error')
})

app.listen(3000, () => {
  console.log('Server running on port 3000')
})
```

`user.js`

```javascript
const mongoose = require('mongoose')

const User = mongoose.model('User', {
  email: { type: String, required: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
})

module.exports = User
```