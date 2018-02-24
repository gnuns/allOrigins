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

  app.route('/get').get(allOrigins.processRequest)

  app.listen(port)
  console.log('Listening on', port)
}
