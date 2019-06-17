/*!
 * AllOrigins
 * written by Gabriel Nunes <gabriel@multiverso.me>
 * http://github.com/gnuns
 */

const app = require('./app.js')
const https = require('https')
const fs = require('fs')

var key = fs.readFileSync(__dirname + '/../certs/selfsigned.key')
var cert = fs.readFileSync(__dirname + '/../certs/selfsigned.crt')
var options = {
  key: key,
  cert: cert
}

var server = https.createServer(options, app)
const port = process.env.PORT || 1458

console.log(`Starting allOrigins v${global.AO_VERSION}`)
server.listen(port, () => console.log('Listening on', port))
