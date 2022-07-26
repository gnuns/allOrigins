const https = require("https");
 const  fs = require("fs");
const app = require('./app.js')
const options = {
  key: fs.readFileSync("./api.sdom.com.key"),
  cert: fs.readFileSync("./api_sdom_com.crt"),
  ca:   fs.readFileSync('./api_sdom_com.ca-bundle')

};


const port = process.env.PORT || 80

console.log(`Starting allOrigins v${global.AO_VERSION}`)

app.listen(port, () => console.log('Listening on', port))


https.createServer(options, app).listen(443, ()=>console.log('listening on ', 443));
