/*!
 * AllOrigins
 * written by Gabriel Nunes <gabriel@multiverso.me>
 * http://github.com/gnuns
 */
const express     = require('express')
const config      = require('./config')
const allOrigins  = require('./lib')

const app    = express()

start()

function start () {
  const port = process.env.PORT || config.port
  app.set('case sensitive routing', false)
  app.disable('x-powered-by')
  app.use(enableCORS)

  app.all('/:format', allOrigins.processRequest)

  app.listen(port)
  console.log('Listening on', port)
}

function enableCORS (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PATCH, PUT, DELETE')
  res.header('Via', 'allOrigins')
  next()
}
