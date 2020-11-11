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

// const app = express()

// app.set('case sensitive routing', false)
// app.disable('x-powered-by')
// app.use(enableCORS)

// app.all('/:format', processRequest)

function setBaseHeaders(req, res) {
  res.writeStatus('200 OK')
  res.writeHeader('Access-Control-Allow-Origin', req.getHeader('origin') || '*')
  res.writeHeader('Access-Control-Allow-Credentials', 'true')
  res.writeHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Content-Encoding, Accept'
  )
  res.writeHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PATCH, PUT, DELETE'
  )
  res.writeHeader('Via', `allOrigins v${version}`)
}

const uWS = require('uWebSockets.js')

const app = uWS.App({}).any('/:format', (res, req) => {
  res.onAborted(() => {
    try {
      res.tryEnd()
    } catch(_){}
  })

  return res.cork(async () => {
    setBaseHeaders(req, res)
    const format = req.getParameter(0)
    req.format = format
    await processRequest({ req, res }).catch((e) => console.error({ e }))
    res.end();
  })
})

module.exports = app
