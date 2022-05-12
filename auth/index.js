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
