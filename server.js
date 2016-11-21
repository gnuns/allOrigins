/*!
 * AllOrigins
 * written by Gabriel 'Hezag' Nunes <tohezag@gmail.com>
 * http://github.com/gnuns
 */

var express     = require('express');
var config      = require('./config');
var allOrigins  = require('./all-origins');

var router = express.Router();
var app    = express();

start();

function start() {

  router.get('/get', allOrigins.processRequest);
  app.use(router);
  app.listen(config.port);
  console.log('Listening on ' + config.port);
}
