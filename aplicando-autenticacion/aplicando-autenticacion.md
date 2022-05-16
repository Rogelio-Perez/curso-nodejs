# Aplicando autentciacion en una aplicacion
Para esta parte vamos a necesitar una aplicacion, la cual podras encontrar aqui [**Aplicacion**](../sharable%2Bclase%2B4/), esta aplicacion es parecida a la que construimos de usuarios, esta es una app, con una base de datos, una API REST, una autenticacion y una autorizacion. En la parte de 
```js
mongoose.connect('tu url de mongo atlas')
```
Debes poner el url que utilizamos en clases pasadas. Puedes revisar los archivos, y todo es lo que hemos visto en las clases pasadas. Si te das cuenta es muy parecida a la aplicacion de Users, solo que ahora tiene Animals.

# Repaso de logica de login y registro
Lo primero que haremos es crear un archivo llamado `auth.controller.js` y ahi escribireos lo de las otras clases, pero de una forma mas rapida. En el cual escribiremos lo siguiente:

```js
const express = require('express')
const bcrypt = require('bcrypt')
const expressJwt = require('express-jwt')
const jwt = require('jsonwebtoken')
const User = require('./user.model')

const validateJwt = expressJwt({ secret: process.env.SECRET, algorithms: ['HS256'] })

const signToken = _id => jwt.sign({ _id }, process.env.SECRET)

const findAndAssingUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    if(!user) {
      return res.status(401).end()
    }
    req.user = user
    next()
  } catch (e) {
    next(e)
  }
}

const isAuthenticated = express.Router().use(validateJwt, findAndAssingUser)

const Auth = {
  login: async (req, res) => {
    const {body} = req
    try{
      const user = await User.findOne({email: body.email})
      if(!user) {
        return res.status(401).send('Usuario y/o contraseña invalida')
      } else {
        const isMatch = await bcrypt.compare(body.password, user.password)
        if(!isMatch) {
          const signed = signToken(user._id)
          res.status(200).send(signed)
        } else {
          return res.status(401).send('Usuario y/o contraseña invalida')
        }
      }
    }
    catch(e) {
      res.send(e.message)
    }
  },
  register: async (req, res) => {
    const {body} = req
    try {
      const isUser = await User.findOne({email: body.email})
      if(isUser) {
        res.send('Usuario ya existe')
      } else {
        const salt = await bcrypt.genSalt()
        const hashed = await bcrypt.hash(body.password, salt)
        const user = await User.create({ email: body.email, password: hashed, salt })

        const signed = signToken(user._id)
        res.send(signed)
      }
    } catch (e) {
      res.status(500).send(e.message)
    }
  },
}

module.exports = {Auth, isAuthenticated}
```

Creacion del Modelo de User, creamos el archivo llamado `user.model.js`

```js
const mongoose = require('mongoose')

const Users = mongoose.model('Users', {
  email: { type: String, required: true, minLength: 5 }, 
  password: { type: String, required: true }, 
  salt: { type: String, required: true }, 
})

module.exports = Users
```

Una ves terminado esto podemos ir a nuestro archivo de `api.js` y debemos importar el modelo de User, para que podamos crear un usuario, y para que podamos hacer login.

```js
const { Auth, isAuthenticated } = require('./auth.controller')

app.post('/login', Auth.login)
app.post('/register', Auth.register)
```
Ahora vamos a proteger todas las rutas que ya teniamos, todo el endpoint de animals, no podremos obtener ningun animal sin antes haber hecho login.

```js
app.get('/animals', isAuthenticated, Animal.list)
app.post('/animals', isAuthenticated, Animal.create)
app.put('/animals/:id', isAuthenticated, Animal.update)
app.patch('/animals/:id', isAuthenticated, Animal.update)
app.delete('/animals/:id', isAuthenticated, Animal.destroy)
```
Con esto ya protegimos los endpoints y ahora vamos a pasar a crear la autorizacion y autenticacion del lado del cliente utilizando solo JavaScript.

# Contruyendo formulario de login

Vamos a ir a nuestra carpeta de `app` y a nuestro archivo `main.js`, y hasta el final debemos revisar que el usuario inicio secion con exitos, esto se vera si se encuentra un JWT en el localStorage.

```js
const checkLogin = () => localStorage.getItem('jwt')

const animalsPage = () => {
	loadInitialTemplate()
	addFormListener()
  getAnimals()
}

window.onload = () => {
	const isLoggedIn = checkLogin()
	if (isLoggedIn) {
		animalsPage()
	}	
}
```

Ahora manejaremos el caso en el cual el usuario no halla iniciado sesion:

```js
const loadLoginTemplate = () => {
	const template = `
	<h1>Login</h1>
	<form id="login-form">
		<div>
			<label>Correo</label>
			<input name="email" />
		</div>
		<div>
			<label>Password</label>
			<input name="password" />
		</div>
		<button type="submit">Enviar</button>
	</form>
	<div id="error"></div>
`

	const body = document.getElementsByTagName('body')[0]
	body.innerHTML = template
}

window.onload = () => {
	const isLoggedIn = checkLogin()
	if (isLoggedIn) {
		animalsPage()
	} else {
		loadLoginTemplate()
	}	
}
```
Esto se mostrara siempre que nosotros no hallamos iniciado sesion, y cuando iniciemos sesion, se mostrara la pagina de animales. 

Ahora vamos a probar nuestra aplicacion, pero antres dentro de `bash` vamos a escribir 
```bash
export SECRET=mi-secreto
```
Corremos la app con:
```bash
node api.js

Arrancando la aplicacion en el puerto 3000
```
Y veremos nuestro formulario, ahora le daremos vida.

# Login onsubmit
Vamos a continuar con nuestro boton de enviar, vamos a ir al archivo de `main.js` y abajo de la funcion de `loadLoginTemplate` , crearemos la nueva funcion:

```js
const addLoginListener = () => {
	const loginForm = document.getElementById('login-form')
	loginForm.onsubmit = async (e) => {
		e.preventDefault()
		const formData = new FormData(loginForm)
		const data = Object.fromEntries(formData.entries())

		const response = await	 fetch('/login', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
			}
		})
		const responseData = response.text()
		if (response.status >= 300) {
			const errorNode = document.getElementById('error')
			errorNode.innerHTML = responseData
		} else {
			console.log(responseData)
		}
	}
}

window.onload = () => {
	const isLoggedIn = checkLogin()
	if (isLoggedIn) {
		animalsPage()
	} else {
		loadLoginTemplate()
		addLoginListener()
	}	
}
```
Podemos ver la siguiente lista, para identificar que tipo de respuesta nos esta enviando el servidor:

- **1xx informational response** – the request was received, continuing process
- **2xx successful** - the request was successfully received, understood, and accepted
- **3xx redirection** - further action needs to be taken in order to complete the request
- **4xx client error** – the request contains bad syntax or cannot be fulfilled
- **5xx server error** – the server failed to fulfil an apparently valid request

Respuestas mayores o igual a 300 `HTTP >= 300 => error` las consideraremos con un error, y menor que 300 como exito `HTTP <= 300 => exito`.

# Formulario de registro
Crearemos la pantalla de registro, para ello necesitamos un link para que nos mande a esa pagina, y un formulario para que el usuario pueda registrarse.

```js
const loadRegisterTemplate = () => {
	const template = `
	<h1>Register</h1>
	<form id="register-form">
		<div>
			<label>Correo</label>
			<input name="email" />
		</div>
		<div>
			<label>Password</label>
			<input name="password" />
		</div>
		<button type="submit">Enviar</button>
	</form>
	<a href="#" id="login">Iniciar sesion</a>
	<div id="error"></div>
`

	const body = document.getElementsByTagName('body')[0]
	body.innerHTML = template
}

const addRegisterListener = () => {}

const gotoLoginListener = () => {}

const registerPage = () => {
	console.log('Pagina de registro')
	loadRegisterTemplate()
	addRegisterListener()
  gotoLoginListener()
}
```
Despues le daremos comportamiento al inicio de sesion y al formulario de registro.
# onsubmit del registro
Para el formulario de registro es hacer un llamado bastante parecido al que hicimos en el inicio de sesion. Con los header, y el body, y el metodo `POST` y content-type.

```js
const addRegisterListener = () => {
	const registerForm = document.getElementById('register-form')
	registerForm.onsubmit = async (e) => {
		e.preventDefault()
		const formData = new FormData(registerForm)
		const data = Object.fromEntries(formData.entries())

		const response = await	 fetch('/register', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
			}
		})
		const responseData = response.text()
		if (response.status >= 300) {
			const errorNode = document.getElementById('error')
			errorNode.innerHTML = responseData
		} else {
			console.log(responseData)
		}
	}
}
```

# Refactorizando form listener


