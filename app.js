/*!
 * AllOrigins
 * written by Gabriel Nunes <gabriel@multiverso.me>
 * http://github.com/gnuns
 */
const express = require('express')

const { version } = require('./package.json')
// yep, global. it's ok
// https://softwareengineering.stackexchange.com/a/47926/289420
global.AO_VERSION = version

const processRequest = require('./app/process-request')

function enableCORS(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*')
  res.header('Access-Control-Allow-Credentials', true)
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Content-Encoding, Accept'
  )
  res.header(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PATCH, PUT, DELETE'
  )
  res.header('Via', `allOrigins v${version}`)
  next()
}

module.exports = (function app() {
  const app = express()

  app.set('case sensitive routing', false)
  app.set('jsonp callback name', 'callback')
  app.disable('x-powered-by')
  app.enable("trust proxy")
  app.use(enableCORS)

  app.all('/:format(get|raw|json|info)', processRequest)

  return app
})()
