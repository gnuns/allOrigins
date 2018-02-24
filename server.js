/*!
 * AllOrigins
 * written by Gabriel Nunes <gabriel@multiverso.me>
 * http://github.com/gnuns
 */
const express     = require('express')
const config      = require('./config')
const allOrigins  = require('./lib')

const router = express.Router()
const app    = express()

start()

function start () {

  router.get('/get', allOrigins.processRequest)
  app.use(router)
  app.listen(config.port)
  console.log('Listening on ' + config.port)
}
