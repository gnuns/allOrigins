/*!
 * AllOrigins
 * written by Gabriel 'Hezag' Nunes <tohezag@gmail.com>
 * http://github.com/gnuns
 */
'use strict';
const express     = require('express');
const config      = require('./config');
const allOrigins  = require('./all-origins');

const router = express.Router();
const app    = express();

start();

function start() {

  router.get('/get', allOrigins.processRequest);
  app.use(router);
  app.listen(config.port);
  console.log('Listening on ' + config.port);
}
