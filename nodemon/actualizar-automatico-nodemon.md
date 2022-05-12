# Actualizar automaticamente
Esta seccion es especial, debido a que te mostrare como actualizar automaticamente tu aplicacion de [`express`](https://expressjs.com/) utilizando [`nodemon`](https://nodemon.io/) al momento de guardar tus cambios, para este paso te recomiendo ya haber pasado por la seccion de [`Crear una API REST`](../NodeJS-creacion-de-api-rest/NodeJS.md)

# Pasos
- Debemos iniciar un proyecto con `npm init -y`
```json
{
  "name": "nodemon",
  "version": "1.0.0",
  "description": "Utilizar nodemon para actualizar nuestro proyecto",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "Roger",
  "license": "ISC"
}
```
- Instalar las siguientes dependencias:
```
npm i express
```
Y creamos una pequeña aplicacion de express:
```js
const express = require('express')

const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log('Server is running on port: ' + PORT)
})

```
- Seguido de esto debemos instalar la siguiente dependencia de desarrollo:
```
npm i -D nodemon
```
Seguido, vamos al `package.json` y agregamos la siguiente linea:
```json
"scripts": {
    "start": "nodemon index.js"
  },
```
Y en nuestra terminal escribimos:
```
npm run start
```
Y veremos algo como esto en nuestra terminal:
```
> nodemon@1.0.0 start
> nodemon index.js

[nodemon] 2.0.16
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node index.js`
Server is running on port: 3000
```
- Ahora abrimos nuestro proyecto en el navegador `http://localhost:3000/`, y veremos el mensaje de bienvenida `Hello World!`, ahora cambiaremos el mensaje de bienvenida a `Nodemon is watching!`.
```js
app.get('/', (req, res) => {
  res.send('Nodemon is watching!')
})
```
- Guardamos nuestro proyecto, refrescamos la pagina, y veremos que cambio automaticamente el mensaje de bienvenida.

Y de esta forma es como puedes refrescar automaticamente tu aplicacion de express.