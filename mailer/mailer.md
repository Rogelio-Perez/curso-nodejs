# Proyecto Mailer
Vamos a crear una carpeta con nuestro proyecto, e inicializaremos un proyecto con:
```bash
npm init -y
```
Y debemos instalar algunas dependencias para que nuestra aplicacion funcione

```bash
npm i -S express dotenv @sendgrid/mail
```
**dotenv** nos permite leer variables de entorno, en este caso leer la variable de entorno de nuestro proyecto.
**@sendgrid/mail** nos permite enviar correos electronicos.

Una ves instalada vamos a ir a nuestro package.json, nosotros utilizamos `common js` esto queire decir que utilziamos `require` ahora utilizaremos `module`.
Vamos a agregar una propiedad para indicar que utilizaremos modulos, con la propiedad de `"type": "module"`
```json
{
  "name": "mailer",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@sendgrid/mail": "^7.6.2",
    "dotenv": "^16.0.1",
    "express": "^4.18.1"
  }
}
```
Y ya podremos emprezar a trabajar en la aplicacion.

# Diferencias entre module y commonjs

La diferencia al momento de import archivos.
```js
const express = require('express') // CommonJS
import express from 'express' // Module

// Esto no funciona cuando utilizamos module
app.get('/', (req, res) => { 
  res.sendFile(`${__dirname}/app/index.html`)
})

// Nuevo
import path from 'path'

app.get('/', (req, res) => {
  res.sendFile(`${path.resolve()}/index.html`)
})
```
# Creamos el formulario
Vamos a crear el formulario para la apliacion.
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mailer</title>
</head>
<body>
  <h1>Mailer</h1>
  <form id="mailer-form">
    <div>
      <label>Para:</label>
      <input name="to">
    </div>
    <div>
      <label>Asunto:</label>
      <input name="subject">
    </div>
    <div>
      <label>Mensaje:</label>
      <textarea name="html"></textarea>
    </div>
    <button type="submit">Enviar</button>
  </form>
  <div id="error"></div>

  <script src="main.js"></script>
</body>
</html>
```

# Envio de correos con Sendgrid
Vamos a ingresar al sitio de [**SendGrid**](https://sendgrid.com/ "SendGrid") y nos registraremos, debemos acordarnos de validar el correo con el cual vamos a hacer envios de correos utilizando SendGrid.

Una ves iniciado sesion, seguiremos los siguientes pasos:

1. Dirigirse a **Dashboard**
2. Dar click en **Email API**
3. **Integration Guide**
4. Seleccionar **Web API**
5. Seleccionar **NodeJS**
6. Crear la API KEY y copiarla `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`

En el editor debemos crear un nuevo archivo llamado `.env`, en la raiz y ahi crearemos la siguiente variable:
```bash
SGKEY=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
FROM=correo@correo.com
```
Colocando la KEY que nos dio SendGrid en la variable `SGKEY`
Y tambien colocamos el email que validamos para sendgrid en la variable `FROM`.

Despues copiaremos lo que nos muestra la documentacion, aunque despues lo cambiaremos.
```js
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const msg = {
  to: 'test@example.com', // Change to your recipient
  from: 'test@example.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
```

Esto es para buscar todas las variables de entorno que tenemos en nuestro proyecto.
```js
import dotenv from 'dotenv'

dotenv.config()
```
```js
app.get('/', (req, res) => {
  res.sendFile(`${path.resolve()}/index.html`)
  const msg = {
    to: 'test@example.com', // Change to your recipient
    from: process.env.FROM, // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  }
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
})
```
Ahora reiniciamos nuestro servidor, y recargamos la pagina, en nuestra terminal deberiamos ver el mensaje de `Email sent`, pero el correo no se ha enviado.

# Enviando formulario a la API
Vamos a comentar todo el correo de prueba, en `main.js` vamos a verificar que este cargando con exito agregando un `hello world` en la consola.