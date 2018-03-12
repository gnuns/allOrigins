const getPage  = require('./get-page')

module.exports = {
  processRequest
}

async function processRequest (req, res) {
  const startTime = new Date()
  const params = req.query
  const page = await getPage(params.url, params.method)
  return createResponse(page, params, res, startTime)
}

function createResponse (page, params, res, startTime) {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')

  if (params.method === 'raw' && !(page.status || {}).error) {
    res.set('Content-Length', page.contentLength)
    res.set('Content-Type', page.contentType)
    return res.send(page.content)
  }

  if (params.charset) res.set('Content-Type', `application/json charset=${params.charset}`)
  else res.set('Content-Type', 'application/json')

  if (page.status) page.status.response_time = (new Date() - startTime)
  else page.response_time = (new Date() - startTime)

  if (params.callback) return res.jsonp(page)
  return res.send(JSON.stringify(page))
}
