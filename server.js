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

  app.route('/get')
      .options(function processRequest (req, res) {
          res.set('Access-Control-Allow-Origin', '*')
          res.set('Access-Control-Allow-Methods', '*')
          res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
          res.end()
      })
      .get(allOrigins.processRequest)

  app.listen(port)
  console.log('Listening on', port)
}
