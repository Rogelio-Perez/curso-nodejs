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
