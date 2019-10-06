/*!
 * AllOrigins
 * written by Gabriel Nunes <gabriel@multiverso.me>
 * http://github.com/gnuns
 */

const express = require('express')
const fs = require('fs')
const morgan = require('morgan')
const path = require('path')

const {version} = require('./package.json')
// yep, global. it's ok
// https://softwareengineering.stackexchange.com/a/47926/289420
global.AO_VERSION = version

const processRequest  = require('./app/process-request')

const app = express()

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})
app.use(morgan('tiny', {stream: accessLogStream}))

app.set('case sensitive routing', false)
app.disable('x-powered-by')
app.use(enableCORS)

app.all('/:format', processRequest)


function enableCORS (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Content-Encoding, Accept')
  res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PATCH, PUT, DELETE')
  res.header('Via', `allOrigins v${version}`)
  next()
}

module.exports = app
