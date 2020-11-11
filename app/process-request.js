const getPage = require('./get-page')

module.exports = processRequest

async function processRequest({ req, res }) {
  const startTime = new Date()
  const params = parseParams(req)

  if (params.requestMethod === 'OPTIONS') {
    return
  }

  const page = await getPage(params)

  return createResponse(page, params, res, startTime)
}

function parseParams(req) {
  return {
    format: (req.format || 'json').toLowerCase(),
    requestMethod: parseRequestMethod(
      req.getQuery('requestMethod') || req.getMethod()
    ),
    charset: req.getQuery('charset'),
    callback: req.getQuery('callback'),
    url: req.getQuery('url'),
  }
}

function parseRequestMethod(method) {
  method = (method || '').toUpperCase()

  if (['HEAD', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'].includes(method)) {
    return method
  }
  return 'GET'
}

function createResponse(page, params, res, startTime) {
  if (params.format === 'raw' && !(page.status || {}).error) {
    if (page.contentType) {
      res.writeHeader('Content-Length', `${page.contentLength}`)
      res.writeHeader('Content-Type', `${page.contentType}`)
    }
    return res.write(page.content)
  }

  if (params.charset)
    res.writeHeader(
      'Content-Type',
      `application/json; charset=${params.charset}`
    )
  else res.writeHeader('Content-Type', 'application/json')

  if (page.status) page.status.response_time = new Date() - startTime
  else page.response_time = new Date() - startTime

  if (params.callback) return res.jsonp(page)
  return res.write(JSON.stringify(page))
}
