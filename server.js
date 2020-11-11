/*!
 * AllOrigins
 * written by Gabriel Nunes <gabriel@multiverso.me>
 * http://github.com/gnuns
 */

const net = require('net')
const app = require('./app.js')
const port = process.env.PORT || 1458

console.log(`Starting allOrigins v${global.AO_VERSION}`)

app.listen(port, (token) => {
  if (token) {
    console.log('Listening to port ' + port)
  } else {
    console.log('Failed to listen to port ' + port)
  }
})

// app.listen(port, () => console.log('Listening on', port))

// const uWS = require('uWebSockets.js');
// const port = 9001;

// const app = uWS./*SSL*/App({
// ///  key_file_name: 'misc/key.pem',
// //  cert_file_name: 'misc/cert.pem',
// //  passphrase: '1234'
// }).any('/anything', (res, req) => {
//   console.log(req.getQuery("teste"));
//   res.cork(() => {
//     res.writeStatus("200 OK").writeHeader("Some", "Value").write("Hello world!");
//     res.end('\nAny route with method: ' + req.getMethod());
//   });
// }).get('/user/agent', (res, req) => {
//   /* Read headers */
//   res.end('Your user agent is: ' + req.getHeader('user-agent') + ' thank you, come again!');
// }).get('/static/yes', (res, req) => {
//   /* Static match */
//   res.end('This is very static');
// }).get('/candy/:kind', (res, req) => {
//   /* Parameters */
//   res.end('So you want candy? Have some ' + req.getParameter(0) + '!');
// }).get('/*', (res, req) => {
//   /* Wildcards - make sure to catch them last */
//   res.end('Nothing to see here!');
// }).listen(port, (token) => {
//   if (token) {
//     console.log('Listening to port ' + port);
//   } else {
//     console.log('Failed to listen to port ' + port);
//   }
// });
